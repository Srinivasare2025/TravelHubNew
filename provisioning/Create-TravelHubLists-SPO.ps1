<#
.SYNOPSIS
    Provisions all lists, libraries, columns, groups and settings for the
    Travel Hub SPFx solution on SharePoint Online.

.PREREQUISITES
    - PnP.PowerShell (the modern, actively-maintained module — NOT the retired
      SharePointPnPPowerShellOnline/2019 modules used by the classic HTML build):
          Install-Module PnP.PowerShell -Scope CurrentUser
    - Run as a user with at least "Full Control" on the target site.
    - Uses interactive (browser) sign-in. For unattended/CI runs, register an
      Azure AD app and swap Connect-PnPOnline's -Interactive for
      -ClientId/-Thumbprint/-Tenant (app-only auth) — see PnP.PowerShell docs.

.USAGE
    .\Create-TravelHubLists-SPO.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/TravelHub"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl
)

Connect-PnPOnline -Url $SiteUrl -Interactive
Write-Host "Connected to $SiteUrl" -ForegroundColor Green

function Add-ChoiceField {
    param($ListTitle, $InternalName, $DisplayName, [string[]]$Choices, [switch]$Multi)
    $choicesXml = ($Choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ""
    $type = if ($Multi) { "MultiChoice" } else { "Choice" }
    $fieldXml = "<Field Type='$type' Name='$InternalName' DisplayName='$DisplayName' Format='Dropdown'><CHOICES>$choicesXml</CHOICES></Field>"
    Add-PnPFieldFromXml -List $ListTitle -FieldXml $fieldXml | Out-Null
}

function Add-TextField {
    param($ListTitle, $InternalName, $DisplayName, [switch]$Multiline, [switch]$RichText)
    if ($Multiline) {
        $richAttr = if ($RichText) { "TRUE" } else { "FALSE" }
        $fieldXml = "<Field Type='Note' Name='$InternalName' DisplayName='$DisplayName' RichText='$richAttr' RichTextMode='FullHtml' NumLines='6' />"
    } else {
        $fieldXml = "<Field Type='Text' Name='$InternalName' DisplayName='$DisplayName' />"
    }
    Add-PnPFieldFromXml -List $ListTitle -FieldXml $fieldXml | Out-Null
}

function Add-DateField { param($ListTitle, $InternalName, $DisplayName, [switch]$IncludeTime)
    $format = if ($IncludeTime) { "DateTime" } else { "DateOnly" }
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $InternalName -Type DateTime | Out-Null
    Set-PnPField -List $ListTitle -Identity $InternalName -Values @{ DisplayFormat = $format } | Out-Null
}

function Add-YesNoField { param($ListTitle, $InternalName, $DisplayName)
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $InternalName -Type Boolean -AddToDefaultView | Out-Null
}

function Add-NumberField { param($ListTitle, $InternalName, $DisplayName)
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $InternalName -Type Number -AddToDefaultView | Out-Null
}

function Add-UrlField { param($ListTitle, $InternalName, $DisplayName)
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $InternalName -Type URL -AddToDefaultView | Out-Null
}

function Add-PersonField { param($ListTitle, $InternalName, $DisplayName)
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $InternalName -Type User -AddToDefaultView | Out-Null
}

# ---------------------------------------------------------------------------
# 1. TravelPolicies (Document Library)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelPolicies..." -ForegroundColor Cyan
New-PnPList -Title "TravelPolicies" -Template DocumentLibrary -OnQuickLaunch
Add-ChoiceField -ListTitle "TravelPolicies" -InternalName "PolicyCategory" -DisplayName "Policy Category" -Choices @("General","Expense","Visa","Booking","Health & Safety","Sustainability")
Add-ChoiceField -ListTitle "TravelPolicies" -InternalName "Region" -DisplayName "Region" -Choices @("Global","APAC","EMEA","AMER")
Add-DateField   -ListTitle "TravelPolicies" -InternalName "EffectiveDate" -DisplayName "Effective Date"
Add-DateField   -ListTitle "TravelPolicies" -InternalName "ExpiryDate" -DisplayName "Expiry Date"
Add-TextField   -ListTitle "TravelPolicies" -InternalName "PolicyVersion" -DisplayName "Version"
Add-TextField   -ListTitle "TravelPolicies" -InternalName "Summary" -DisplayName "Summary" -Multiline
Add-TextField   -ListTitle "TravelPolicies" -InternalName "PolicyBody" -DisplayName "Policy Body" -Multiline -RichText
Add-YesNoField  -ListTitle "TravelPolicies" -InternalName "IsFeatured" -DisplayName "Is Featured"
Add-PersonField -ListTitle "TravelPolicies" -InternalName "ReviewedBy" -DisplayName "Reviewed By"
Set-PnPList -Identity "TravelPolicies" -EnableModeration $true

# ---------------------------------------------------------------------------
# 2. TravelGuides (Document Library)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelGuides..." -ForegroundColor Cyan
New-PnPList -Title "TravelGuides" -Template DocumentLibrary -OnQuickLaunch
Add-ChoiceField -ListTitle "TravelGuides" -InternalName "GuideType" -DisplayName "Guide Type" -Choices @("Concur Booking","Expense Claim","Visa Process","Timesheet","General")
Add-ChoiceField -ListTitle "TravelGuides" -InternalName "AudienceRole" -DisplayName "Audience Role" -Choices @("Employee","Manager","Admin","Contributor") -Multi
Add-TextField   -ListTitle "TravelGuides" -InternalName "Summary" -DisplayName "Summary" -Multiline
Add-YesNoField  -ListTitle "TravelGuides" -InternalName "IsFeatured" -DisplayName "Is Featured"
Add-DateField   -ListTitle "TravelGuides" -InternalName "PublishDate" -DisplayName "Publish Date"
Set-PnPList -Identity "TravelGuides" -EnableModeration $true

# ---------------------------------------------------------------------------
# 3. TravelForms (Document Library)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelForms..." -ForegroundColor Cyan
New-PnPList -Title "TravelForms" -Template DocumentLibrary -OnQuickLaunch
Add-ChoiceField -ListTitle "TravelForms" -InternalName "FormCategory" -DisplayName "Form Category" -Choices @("Visa","Expense","Booking Exception","Reimbursement","Other")
Add-ChoiceField -ListTitle "TravelForms" -InternalName "Region" -DisplayName "Region" -Choices @("Global","APAC","EMEA","AMER")
Add-TextField   -ListTitle "TravelForms" -InternalName "Instructions" -DisplayName "Instructions" -Multiline

# ---------------------------------------------------------------------------
# 4. TravelFAQs (Custom List)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelFAQs..." -ForegroundColor Cyan
New-PnPList -Title "TravelFAQs" -Template GenericList -OnQuickLaunch
Add-TextField   -ListTitle "TravelFAQs" -InternalName "Answer" -DisplayName "Answer" -Multiline -RichText
Add-ChoiceField -ListTitle "TravelFAQs" -InternalName "Category" -DisplayName "Category" -Choices @("Booking","Expense","Visa","Travel Policy","Other")
Add-NumberField -ListTitle "TravelFAQs" -InternalName "SortOrder" -DisplayName "Sort Order"
Add-YesNoField  -ListTitle "TravelFAQs" -InternalName "IsPublished" -DisplayName "Is Published"

# ---------------------------------------------------------------------------
# 5. TravelPromotions (Custom List)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelPromotions..." -ForegroundColor Cyan
New-PnPList -Title "TravelPromotions" -Template GenericList -OnQuickLaunch
Add-TextField   -ListTitle "TravelPromotions" -InternalName "Description" -DisplayName "Description" -Multiline
Add-UrlField    -ListTitle "TravelPromotions" -InternalName "BannerImage" -DisplayName "Banner Image"
Add-UrlField    -ListTitle "TravelPromotions" -InternalName "LinkURL" -DisplayName "Link URL"
Add-ChoiceField -ListTitle "TravelPromotions" -InternalName "BannerType" -DisplayName "Banner Type" -Choices @("Limited Time","Exclusive","Upcoming Event","Announcement")
Add-DateField   -ListTitle "TravelPromotions" -InternalName "StartDate" -DisplayName "Start Date"
Add-DateField   -ListTitle "TravelPromotions" -InternalName "EndDate" -DisplayName "End Date"
Add-NumberField -ListTitle "TravelPromotions" -InternalName "Priority" -DisplayName "Priority"
Add-YesNoField  -ListTitle "TravelPromotions" -InternalName "IsActive" -DisplayName "Is Active"

# ---------------------------------------------------------------------------
# 6. TravelNews (Custom List)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelNews..." -ForegroundColor Cyan
New-PnPList -Title "TravelNews" -Template GenericList -OnQuickLaunch
Add-TextField   -ListTitle "TravelNews" -InternalName "Summary" -DisplayName "Summary" -Multiline
Add-TextField   -ListTitle "TravelNews" -InternalName "Body" -DisplayName "Body" -Multiline -RichText
Add-ChoiceField -ListTitle "TravelNews" -InternalName "Category" -DisplayName "Category" -Choices @("News","Update","Event")
Add-DateField   -ListTitle "TravelNews" -InternalName "PublishDate" -DisplayName "Publish Date"
Add-UrlField    -ListTitle "TravelNews" -InternalName "ThumbnailImage" -DisplayName "Thumbnail Image"
Add-YesNoField  -ListTitle "TravelNews" -InternalName "IsFeatured" -DisplayName "Is Featured"

# ---------------------------------------------------------------------------
# 7. TravelQuickLinks (Custom List)
# ---------------------------------------------------------------------------
Write-Host "Creating TravelQuickLinks..." -ForegroundColor Cyan
New-PnPList -Title "TravelQuickLinks" -Template GenericList -OnQuickLaunch
Add-UrlField    -ListTitle "TravelQuickLinks" -InternalName "URL" -DisplayName "URL"
Add-TextField   -ListTitle "TravelQuickLinks" -InternalName "IconClass" -DisplayName "Icon Class"
Add-ChoiceField -ListTitle "TravelQuickLinks" -InternalName "Category" -DisplayName "Category" -Choices @("Booking","Policy","Support","Expense")
Add-NumberField -ListTitle "TravelQuickLinks" -InternalName "SortOrder" -DisplayName "Sort Order"
Add-YesNoField  -ListTitle "TravelQuickLinks" -InternalName "OpenInNewTab" -DisplayName "Open In New Tab"

# ---------------------------------------------------------------------------
# 8. TravelHubPageViews (Custom List) — usage analytics
# ---------------------------------------------------------------------------
Write-Host "Creating TravelHubPageViews..." -ForegroundColor Cyan
New-PnPList -Title "TravelHubPageViews" -Template GenericList
Add-TextField   -ListTitle "TravelHubPageViews" -InternalName "UserLoginName" -DisplayName "User Login Name"
Add-ChoiceField -ListTitle "TravelHubPageViews" -InternalName "EventType" -DisplayName "Event Type" -Choices @("PageView","DocumentDownload","LinkClick","SearchQuery")
Add-TextField   -ListTitle "TravelHubPageViews" -InternalName "ItemReference" -DisplayName "Item Reference"
Add-DateField   -ListTitle "TravelHubPageViews" -InternalName "EventDateTime" -DisplayName "Event Date Time" -IncludeTime

Set-PnPList -Identity "TravelHubPageViews" -EnableAttachments $false
# WriteSecurity = 2 -> users can only edit/read their own items; Admins (Full Control) bypass this.
Set-PnPList -Identity "TravelHubPageViews" -WriteSecurity 2

# ---------------------------------------------------------------------------
# 9. TravelHubConfig (Custom List) — key/value runtime configuration read by
#    ConfigService (src/services/ConfigService.ts). One row per setting:
#    Title = key (e.g. "siteUrl", "list_policies", "defaultTheme"), ConfigValue = value.
#    Admins manage these from the Travel Hub Admin web part's Settings page —
#    this list only needs to exist; SettingsPage creates/updates rows itself.
# ---------------------------------------------------------------------------
Write-Host "Creating TravelHubConfig..." -ForegroundColor Cyan
New-PnPList -Title "TravelHubConfig" -Template GenericList
Add-TextField -ListTitle "TravelHubConfig" -InternalName "ConfigValue" -DisplayName "Config Value" -Multiline

# ---------------------------------------------------------------------------
# 10. TravelOffers (Custom List) — Leisure Travel's Featured Offers, Wellness's
#     hotel & package rows, Meetings & Events' partner hotel tiles (Category
#     tells them apart), and Home's "RSG Destination Hotels & Offers" promo card.
# ---------------------------------------------------------------------------
Write-Host "Creating TravelOffers..." -ForegroundColor Cyan
New-PnPList -Title "TravelOffers" -Template GenericList
Add-TextField   -ListTitle "TravelOffers" -InternalName "Subtitle" -DisplayName "Subtitle"
Add-TextField   -ListTitle "TravelOffers" -InternalName "Description" -DisplayName "Description" -Multiline
Add-ChoiceField -ListTitle "TravelOffers" -InternalName "Category" -DisplayName "Category" -Choices @("Leisure","Wellness","Hotel Partner")
# Free-form facets (city name, 'Riyadh Hotels', 'Red Sea Destination Hotels', ...) — semicolon-separate multiple values.
Add-TextField   -ListTitle "TravelOffers" -InternalName "Tags" -DisplayName "Tags"
Add-UrlField    -ListTitle "TravelOffers" -InternalName "Image" -DisplayName "Image"
Add-TextField   -ListTitle "TravelOffers" -InternalName "Price" -DisplayName "Price"
Add-TextField   -ListTitle "TravelOffers" -InternalName "PriceNote" -DisplayName "Price Note"
Add-TextField   -ListTitle "TravelOffers" -InternalName "Badge" -DisplayName "Badge"
Add-ChoiceField -ListTitle "TravelOffers" -InternalName "BadgeVariant" -DisplayName "Badge Variant" -Choices @("limited","exclusive","event","announcement")
Add-TextField   -ListTitle "TravelOffers" -InternalName "Location" -DisplayName "Location"
Add-TextField   -ListTitle "TravelOffers" -InternalName "CtaLabel" -DisplayName "CTA Label"
Add-NumberField -ListTitle "TravelOffers" -InternalName "SortOrder" -DisplayName "Sort Order"

# ---------------------------------------------------------------------------
# 11. TravelCateringMenus (Custom List) — Catering page's menu packages.
# ---------------------------------------------------------------------------
Write-Host "Creating TravelCateringMenus..." -ForegroundColor Cyan
New-PnPList -Title "TravelCateringMenus" -Template GenericList
Add-TextField   -ListTitle "TravelCateringMenus" -InternalName "Name" -DisplayName "Name"
Add-TextField   -ListTitle "TravelCateringMenus" -InternalName "Description" -DisplayName "Description"
# One item per line.
Add-TextField   -ListTitle "TravelCateringMenus" -InternalName "Items" -DisplayName "Items" -Multiline
Add-UrlField    -ListTitle "TravelCateringMenus" -InternalName "Image" -DisplayName "Image"
Add-NumberField -ListTitle "TravelCateringMenus" -InternalName "SortOrder" -DisplayName "Sort Order"

# ---------------------------------------------------------------------------
# 12. TravelSustainabilityMetrics (Custom List) — Sustainability page's and
#     Home's "Our Impact" / stat-strip rows.
# ---------------------------------------------------------------------------
Write-Host "Creating TravelSustainabilityMetrics..." -ForegroundColor Cyan
New-PnPList -Title "TravelSustainabilityMetrics" -Template GenericList
Add-TextField   -ListTitle "TravelSustainabilityMetrics" -InternalName "Icon" -DisplayName "Icon"
Add-TextField   -ListTitle "TravelSustainabilityMetrics" -InternalName "Value" -DisplayName "Value"
Add-TextField   -ListTitle "TravelSustainabilityMetrics" -InternalName "Label" -DisplayName "Label"
Add-TextField   -ListTitle "TravelSustainabilityMetrics" -InternalName "DeltaLabel" -DisplayName "Delta Label"
Add-NumberField -ListTitle "TravelSustainabilityMetrics" -InternalName "SortOrder" -DisplayName "Sort Order"

# ---------------------------------------------------------------------------
# 13. TravelServicesTeam (Custom List) — Home's "Meet the Travel Services Team".
# ---------------------------------------------------------------------------
Write-Host "Creating TravelServicesTeam..." -ForegroundColor Cyan
New-PnPList -Title "TravelServicesTeam" -Template GenericList
Add-TextField   -ListTitle "TravelServicesTeam" -InternalName "Name" -DisplayName "Name"
Add-TextField   -ListTitle "TravelServicesTeam" -InternalName "Role" -DisplayName "Role"
Add-TextField   -ListTitle "TravelServicesTeam" -InternalName "Department" -DisplayName "Department"
Add-UrlField    -ListTitle "TravelServicesTeam" -InternalName "Photo" -DisplayName "Photo"
Add-TextField   -ListTitle "TravelServicesTeam" -InternalName "Email" -DisplayName "Email"
Add-TextField   -ListTitle "TravelServicesTeam" -InternalName "Phone" -DisplayName "Phone"
Add-UrlField    -ListTitle "TravelServicesTeam" -InternalName "LinkedInUrl" -DisplayName "LinkedIn URL"
Add-NumberField -ListTitle "TravelServicesTeam" -InternalName "SortOrder" -DisplayName "Sort Order"

# ---------------------------------------------------------------------------
# 14. TravelTestimonials (Custom List) — Home Alternate's "What Our Travelers Say".
# ---------------------------------------------------------------------------
Write-Host "Creating TravelTestimonials..." -ForegroundColor Cyan
New-PnPList -Title "TravelTestimonials" -Template GenericList
Add-TextField   -ListTitle "TravelTestimonials" -InternalName "Quote" -DisplayName "Quote" -Multiline
Add-TextField   -ListTitle "TravelTestimonials" -InternalName "Name" -DisplayName "Name"
Add-TextField   -ListTitle "TravelTestimonials" -InternalName "Role" -DisplayName "Role"
Add-UrlField    -ListTitle "TravelTestimonials" -InternalName "Photo" -DisplayName "Photo"
Add-NumberField -ListTitle "TravelTestimonials" -InternalName "SortOrder" -DisplayName "Sort Order"

# ---------------------------------------------------------------------------
# Groups & permissions
# ---------------------------------------------------------------------------
Write-Host "Creating SharePoint groups..." -ForegroundColor Cyan
New-PnPGroup -Title "Travel Hub Visitors" -Description "Read-only access to Travel Hub content"
New-PnPGroup -Title "Travel Hub Contributors" -Description "Can draft policies, guides and news for approval"
New-PnPGroup -Title "Travel Hub Admins" -Description "Full control, including content approval, settings and analytics"

Set-PnPGroupPermissions -Identity "Travel Hub Visitors" -AddRole "Read"
Set-PnPGroupPermissions -Identity "Travel Hub Contributors" -AddRole "Contribute"
Set-PnPGroupPermissions -Identity "Travel Hub Admins" -AddRole "Full Control"

# ---------------------------------------------------------------------------
# Media Library folder (for the Admin "Media Library" screen and image-upload fields)
# ---------------------------------------------------------------------------
Write-Host "Creating SiteAssets/travelhub/uploads folder..." -ForegroundColor Cyan
if (-not (Get-PnPFolder -Url "SiteAssets/travelhub" -ErrorAction SilentlyContinue)) {
    Resolve-PnPFolder -SiteRelativePath "SiteAssets/travelhub/uploads" | Out-Null
}

# ---------------------------------------------------------------------------
# Audit trail
# ---------------------------------------------------------------------------
Write-Host "Enabling audit settings..." -ForegroundColor Cyan
Set-PnPAuditing -EditItems -CheckOutCheckInItems -DeleteRestoreItems -EditContentTypesColumns -EditUsersAndPermissions -SearchContent

Write-Host "`nTravel Hub provisioning complete." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host " 1. Seed TravelQuickLinks with your Concur deep links (Book Flight, Book Hotel, Rental Car, etc.)."
Write-Host "    Icon Class values are Fluent UI icon names (e.g. Airplane, CityNext, Car) — see"
Write-Host "    https://developer.microsoft.com/fluentui#/styles/web/icons"
Write-Host " 2. If TravelHub's lists live on a DIFFERENT site than where you'll place the web parts,"
Write-Host "    set 'Lists Site URL' in Admin > Settings after the SPFx package is deployed (Step 2 below)."
Write-Host " 3. Build and deploy the SPFx package — see README.md 'Deploying to SharePoint Online':"
Write-Host "      npm install && npm run dist"
Write-Host "    then upload solution/travel-hub-spfx.sppkg to your tenant App Catalog."
Write-Host " 4. Add the 'Travel Hub' web part to a modern page (public), and the 'Travel Hub Admin' web part"
Write-Host "    to a separate, non-public-nav page for Admins/Contributors."
