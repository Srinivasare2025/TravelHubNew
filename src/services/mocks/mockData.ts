import {
  IPolicy, IGuide, IForm, IFaq, IPromotion, INewsItem, IQuickLink, ModerationStatus, IPageViewEvent,
  IOffer, ICateringMenu, ISustainabilityMetric, ITeamMember, ITestimonial, ISapConcurInfo, IDashboardAnalytics
} from '../../models';

/** Seed dates relative to "now" so the mock never silently goes stale. */
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}

export interface IMockStore {
  TravelPolicies: IPolicy[];
  TravelGuides: IGuide[];
  TravelForms: IForm[];
  TravelFAQs: IFaq[];
  TravelPromotions: IPromotion[];
  TravelNews: INewsItem[];
  TravelQuickLinks: IQuickLink[];
  TravelHubPageViews: IPageViewEvent[];
  TravelOffers: IOffer[];
  TravelCateringMenus: ICateringMenu[];
  TravelSustainabilityMetrics: ISustainabilityMetric[];
  TravelServicesTeam: ITeamMember[];
  TravelTestimonials: ITestimonial[];
  [key: string]: unknown[];
}

export function createMockStore(): IMockStore {
  const store: IMockStore = {
    TravelPolicies: [
      {
        Id: 1, Title: 'Global Travel & Expense Policy', PolicyCategory: 'General', Region: 'Global',
        EffectiveDate: '2026-01-01', PolicyVersion: '3.2',
        Summary: 'The master policy covering booking classes, per-diem and approvals.',
        PolicyBody: '<h3>1. Purpose</h3><p>Outlines guidelines for all business travel.</p><h3>2. Scope</h3><p>Applies to all employees, contractors and consultants.</p>',
        IsFeatured: true, FileRef: '#', FileLeafRef: 'General-Travel-Policy.pdf', Modified: '2026-05-15',
        OData__ModerationStatus: ModerationStatus.Approved, ReviewedBy: { Title: 'Sarah Ahmed' }
      },
      {
        Id: 2, Title: 'Expense Policy', PolicyCategory: 'Expense', Region: 'Global', EffectiveDate: '2026-01-10',
        PolicyVersion: '2.0', Summary: 'Rules for claiming and approving travel expenses.',
        PolicyBody: '<h3>1. Purpose</h3><p>Defines reimbursable expenses and the approval workflow.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Expense-Policy.pdf', Modified: '2026-05-10',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 3, Title: 'Visa Policy', PolicyCategory: 'Visa', Region: 'Global', EffectiveDate: '2026-02-01',
        PolicyVersion: '1.4', Summary: 'When the company sponsors visa applications and how to request it.',
        PolicyBody: '<h3>1. Purpose</h3><p>Clarifies visa sponsorship eligibility for international travel.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Visa-Policy.pdf', Modified: '2026-05-08',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 4, Title: 'Booking Guidelines', PolicyCategory: 'Booking', Region: 'Global', EffectiveDate: '2026-01-05',
        PolicyVersion: '1.1', Summary: 'Preferred booking classes and lead-time requirements.',
        PolicyBody: '<h3>1. Purpose</h3><p>Sets booking class and lead-time expectations.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Booking-Guidelines.pdf', Modified: '2026-05-05',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 5, Title: 'Health & Safety Policy', PolicyCategory: 'Health & Safety', Region: 'Global', EffectiveDate: '2026-02-15',
        PolicyVersion: '1.0', Summary: 'Mandatory safety briefings and insurance requirements for travel abroad.',
        PolicyBody: '<h3>1. Purpose</h3><p>Mandatory safety briefings for international travel.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Health-Safety-Policy.pdf', Modified: daysFromNow(-5),
        OData__ModerationStatus: ModerationStatus.Pending
      },
      {
        Id: 6, Title: 'Sustainability Guidelines', PolicyCategory: 'Sustainability', Region: 'Global', EffectiveDate: '2026-03-01',
        PolicyVersion: '1.0', Summary: 'Preferring lower-carbon travel options where practical.',
        PolicyBody: '<h3>1. Purpose</h3><p>Encourages lower-carbon travel choices where practical.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Sustainability-Guidelines.pdf', Modified: '2026-04-28',
        OData__ModerationStatus: ModerationStatus.Draft
      }
    ],
    TravelGuides: [
      {
        Id: 1, Title: 'Travel Guide - Flights', GuideType: 'Concur Booking', AudienceRole: { results: ['Employee'] },
        Summary: 'Step-by-step walkthrough for booking flights in Concur.', IsFeatured: true, PublishDate: '2026-05-01',
        FileRef: '#', FileLeafRef: 'Guide-Flights.pdf', Modified: '2026-05-01', OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 2, Title: 'Travel Guide - Hotels', GuideType: 'Concur Booking', AudienceRole: { results: ['Employee'] },
        Summary: 'How to search and book hotels within policy.', IsFeatured: true, PublishDate: '2026-04-20',
        FileRef: '#', FileLeafRef: 'Guide-Hotels.pdf', Modified: '2026-04-20', OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 3, Title: 'Visa Requirements Guide', GuideType: 'Visa Process', AudienceRole: { results: ['Employee', 'Manager'] },
        Summary: 'Country-specific visa requirement checklists.', IsFeatured: false, PublishDate: '2026-04-10',
        FileRef: '#', FileLeafRef: 'Guide-Visa.pdf', Modified: daysFromNow(-2), OData__ModerationStatus: ModerationStatus.Approved
      }
    ],
    TravelForms: [
      { Id: 1, Title: 'Travel Request Form', FormCategory: 'Booking Exception', Region: 'Global', Instructions: 'Use for booking exceptions.', FileRef: '#', FileLeafRef: 'Travel-Request-Form.docx', Modified: '2026-05-01' },
      { Id: 2, Title: 'Expense Claim Form', FormCategory: 'Expense', Region: 'Global', Instructions: 'Submit within 10 business days.', FileRef: '#', FileLeafRef: 'Expense-Claim-Form.docx', Modified: '2026-04-15' },
      { Id: 3, Title: 'Visa Requirements Guide', FormCategory: 'Visa', Region: 'Global', Instructions: 'Checklist per country.', FileRef: '#', FileLeafRef: 'Visa-Requirements.pdf', Modified: '2026-04-01' },
      { Id: 4, Title: 'Packing Checklist', FormCategory: 'Other', Region: 'Global', Instructions: 'Optional packing checklist.', FileRef: '#', FileLeafRef: 'Packing-Checklist.pdf', Modified: '2026-03-20' },
      { Id: 5, Title: 'Per Diem Rates', FormCategory: 'Expense', Region: 'Global', Instructions: 'Current per-diem table.', FileRef: '#', FileLeafRef: 'Per-Diem-Rates.xlsx', Modified: '2026-03-10' },
      { Id: 6, Title: 'Travel Insurance Info', FormCategory: 'Other', Region: 'Global', Instructions: 'Corporate insurance summary.', FileRef: '#', FileLeafRef: 'Travel-Insurance-Info.pdf', Modified: '2026-02-28' }
    ],
    TravelFAQs: [
      { Id: 1, Title: 'How do I book a flight through Concur?', Answer: 'Go to Book Travel &gt; Book with Concur, sign in with SSO, and search your itinerary.', Category: 'Booking', SortOrder: 1, IsPublished: true },
      { Id: 2, Title: 'What is the baggage allowance for business travel?', Answer: "Baggage allowance follows the airline's standard fare rules.", Category: 'Booking', SortOrder: 2, IsPublished: true },
      { Id: 3, Title: 'How do I claim my travel expenses?', Answer: 'Submit the Expense Claim Form within 10 business days.', Category: 'Expense', SortOrder: 1, IsPublished: true },
      { Id: 4, Title: 'How long does it take to get visa approval?', Answer: 'Typically 5-10 business days depending on destination.', Category: 'Visa', SortOrder: 1, IsPublished: true },
      { Id: 5, Title: 'What should I do in case of a travel emergency?', Answer: 'Call the 24/7 travel emergency line and notify your manager.', Category: 'Other', SortOrder: 1, IsPublished: true },
      { Id: 6, Title: 'Can I extend a business trip for personal travel?', Answer: 'Yes, with manager approval.', Category: 'Travel Policy', SortOrder: 1, IsPublished: true },
      { Id: 7, Title: 'Draft: refund policy for cancelled trips', Answer: 'Not yet finalized.', Category: 'Other', SortOrder: 2, IsPublished: false }
    ],
    TravelPromotions: [
      { Id: 1, Title: '25% Off on Select Hotels', Description: 'Book within the next 30 days.', BannerType: 'Limited Time', StartDate: daysFromNow(-10), EndDate: daysFromNow(30), Priority: 1, IsActive: true, Modified: daysFromNow(-10) },
      { Id: 2, Title: 'Save on Business Flights', Description: 'Up to 15% off on international bookings.', BannerType: 'Exclusive', StartDate: daysFromNow(-5), EndDate: daysFromNow(45), Priority: 2, IsActive: true, Modified: daysFromNow(-5) },
      { Id: 3, Title: 'Travel Awareness Webinar', Description: 'Live webinar — register now.', BannerType: 'Upcoming Event', StartDate: daysFromNow(7), EndDate: daysFromNow(7), Priority: 3, IsActive: true, Modified: '2026-04-01' }
    ],
    TravelNews: [
      { Id: 1, Title: 'New Corporate Hotel Program Launched', Summary: 'Preferred hotel rates now live across 12 destinations.', Body: 'Full article body...', Category: 'News', PublishDate: '2026-05-15', IsFeatured: true, Modified: '2026-05-15' },
      { Id: 2, Title: 'Travel Policy Updates', Summary: 'Policy changes effective from June 2026.', Body: 'Full article body...', Category: 'Update', PublishDate: '2026-05-10', IsFeatured: false, Modified: '2026-05-10' },
      { Id: 3, Title: 'Sustainability in Travel', Summary: 'Our commitment to green travel.', Body: 'Full article body...', Category: 'News', PublishDate: '2026-05-08', IsFeatured: false, Modified: '2026-05-08' },
      { Id: 4, Title: 'Top Destinations for 2026', Summary: 'Explore trending business travel destinations.', Body: 'Full article body...', Category: 'Update', PublishDate: '2026-05-05', IsFeatured: false, Modified: '2026-05-05' }
    ],
    TravelQuickLinks: [
      { Id: 1, Title: 'Book Flight', URL: { Url: '#' }, IconClass: 'Airplane', Category: 'Booking', SortOrder: 1, OpenInNewTab: true },
      { Id: 2, Title: 'Book Hotel', URL: { Url: '#' }, IconClass: 'CityNext', Category: 'Booking', SortOrder: 2, OpenInNewTab: true },
      { Id: 3, Title: 'Rental Car', URL: { Url: '#' }, IconClass: 'Car', Category: 'Booking', SortOrder: 3, OpenInNewTab: true },
      { Id: 4, Title: 'Travel Policies', URL: { Url: '#/policies' }, IconClass: 'Shield', Category: 'Policy', SortOrder: 4, OpenInNewTab: false },
      { Id: 5, Title: 'User Guides', URL: { Url: '#/resources?type=Guide' }, IconClass: 'ReadingMode', Category: 'Support', SortOrder: 5, OpenInNewTab: false },
      { Id: 6, Title: 'Travel Forms', URL: { Url: '#/resources?type=Form' }, IconClass: 'DocumentSet', Category: 'Support', SortOrder: 6, OpenInNewTab: false },
      { Id: 7, Title: 'FAQs', URL: { Url: '#/faqs' }, IconClass: 'Help', Category: 'Support', SortOrder: 7, OpenInNewTab: false }
    ],
    TravelHubPageViews: [],
    TravelOffers: [
      // ---- Leisure Travel: Featured Offers ----
      { Id: 1, Title: 'The Red Sea Resort', Location: 'The Red Sea', Category: 'Leisure', Tags: ['Featured'], Description: 'Luxury stays with private beaches, world-class dining and spa.', Price: 'SAR 850 / night', PriceNote: 'Save up to 25%', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 1 },
      { Id: 2, Title: 'Riyadh Weekend Escape', Location: 'Riyadh', Category: 'Leisure', Tags: ['Featured'], Description: 'Enjoy a relaxing weekend in the heart of the city.', Price: 'SAR 450 / night', PriceNote: 'Save up to 20%', Badge: 'Weekend Offer', BadgeVariant: 'event', CtaLabel: 'View Offer', SortOrder: 2 },
      { Id: 3, Title: 'Eid Getaway Package', Location: 'Multiple Destinations', Category: 'Leisure', Tags: ['Featured'], Description: 'Celebrate Eid with your family with special holiday packages.', Price: 'SAR 1,250 / night', PriceNote: 'Save up to 30%', Badge: 'Eid Special', BadgeVariant: 'announcement', CtaLabel: 'View Offer', SortOrder: 3 },
      { Id: 4, Title: 'Family Island Retreat', Location: 'Maldives', Category: 'Leisure', Tags: ['Featured'], Description: 'All-inclusive family packages with exciting activities for all ages.', Price: 'SAR 1,890 / night', PriceNote: 'Save up to 28%', Badge: 'Family Package', BadgeVariant: 'limited', CtaLabel: 'View Offer', SortOrder: 4 },

      // ---- Wellness: Riyadh Hotels ----
      { Id: 10, Title: 'Mandarin Oriental Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Luxury SPA, Afternoon Tea & Pool Access', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 1 },
      { Id: 11, Title: 'Mansard Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Wellness Day Pass, Fitness & Dining', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 2 },
      { Id: 12, Title: 'W Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Energy Recharge Package — SPA, Pool & F&B', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 3 },
      { Id: 13, Title: 'Kimpton Kafd Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Fitness, Recovery & Staycation', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 4 },
      { Id: 14, Title: 'Fairmont Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Couple Retreat, SPA & Dinner', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 5 },
      { Id: 15, Title: 'Narcissus Riyadh', Category: 'Wellness', Tags: ['Riyadh Hotels'], Description: 'Detox Weekend & Massage', Badge: 'Exclusive', BadgeVariant: 'exclusive', CtaLabel: 'View Offer', SortOrder: 6 },

      // ---- Wellness: Red Sea Destination Hotels ----
      { Id: 20, Title: 'Six Senses Southern Dunes', Location: 'The Red Sea', Category: 'Wellness', Tags: ['Red Sea Destination Hotels'], Description: 'Wellness, Longevity & Nature', CtaLabel: 'View Offers', SortOrder: 1 },
      { Id: 21, Title: 'The St. Regis Red Sea', Location: 'The Red Sea', Category: 'Wellness', Tags: ['Red Sea Destination Hotels'], Description: 'Luxury Island Escape', CtaLabel: 'View Offers', SortOrder: 2 },
      { Id: 22, Title: 'IHG Shura Island Red Sea', Location: 'The Red Sea', Category: 'Wellness', Tags: ['Red Sea Destination Hotels'], Description: 'Island Retreat & Recovery', CtaLabel: 'View Offers', SortOrder: 3 },

      // ---- Wellness: Popular Wellness Packages ----
      { Id: 30, Title: 'Executive Recharge', Category: 'Wellness', Tags: ['Popular Packages'], Description: '1 Day • SPA Treatment (60 min), Healthy Lunch, Gym & Pool Access, Wellness Consultation', Price: 'From SAR 799', CtaLabel: 'View Details', SortOrder: 1 },
      { Id: 31, Title: 'Couple Wellness Escape', Category: 'Wellness', Tags: ['Popular Packages'], Description: '1 Night • Couple Massage, Dinner Experience, Overnight Stay, Breakfast & Late Checkout', Price: 'From SAR 1,499', CtaLabel: 'View Details', SortOrder: 2 },
      { Id: 32, Title: 'Weekend Reset', Category: 'Wellness', Tags: ['Popular Packages'], Description: '2 Days / 1 Night • Hotel Stay, Yoga & Fitness Class, Healthy Meals, SPA Treatment', Price: 'From SAR 999', CtaLabel: 'View Details', SortOrder: 3 },
      { Id: 33, Title: 'Red Sea Rejuvenation Retreat', Category: 'Wellness', Tags: ['Popular Packages'], Description: '2 Nights • Luxury Stay, Ocean Wellness Activities, SPA & Nutrition, Marine Experience', Price: 'From SAR 2,499', CtaLabel: 'View Details', SortOrder: 4 },

      // ---- Meetings & Events: Partner Hotels ----
      { Id: 40, Title: 'Mandarin Oriental Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 1 },
      { Id: 41, Title: 'Four Seasons Hotel Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 2 },
      { Id: 42, Title: 'Fairmont Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 3 },
      { Id: 43, Title: 'Kimpton Kafd Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 4 },
      { Id: 44, Title: 'JW Marriott Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 5 },
      { Id: 45, Title: 'Crowne Plaza Riyadh', Category: 'Hotel Partner', Tags: ['Riyadh'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 6 },
      { Id: 46, Title: 'EDITION Jeddah', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 7 },
      { Id: 47, Title: 'Jeddah Hilton', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 8 },
      { Id: 48, Title: 'Sheraton Jeddah Hotel', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 9 },
      { Id: 49, Title: 'voco Jeddah Gate', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 10 },
      { Id: 50, Title: 'InterContinental Jeddah', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 11 },
      { Id: 51, Title: 'Mövenpick Hotel Jeddah', Category: 'Hotel Partner', Tags: ['Jeddah'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 12 },
      { Id: 52, Title: 'Sheraton Dammam Hotel & Convention Centre', Category: 'Hotel Partner', Tags: ['Dammam'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 13 },
      { Id: 53, Title: 'Mövenpick Hotel Dammam', Category: 'Hotel Partner', Tags: ['Dammam'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 14 },
      { Id: 54, Title: 'Holiday Inn Dammam', Category: 'Hotel Partner', Tags: ['Dammam'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 15 },
      { Id: 55, Title: 'Swiss International Tabuk', Category: 'Hotel Partner', Tags: ['Tabuk'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 16 },
      { Id: 56, Title: 'Mövenpick Hotel Tabuk', Category: 'Hotel Partner', Tags: ['Tabuk'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 17 },
      { Id: 57, Title: 'Millennium Hotel & Resorts Tabuk', Category: 'Hotel Partner', Tags: ['Tabuk'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 18 },
      { Id: 58, Title: 'Hyatt Regency Umluj', Category: 'Hotel Partner', Tags: ['Umluj'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 19 },
      { Id: 59, Title: 'Shura Island Resort', Category: 'Hotel Partner', Tags: ['Umluj'], Description: 'Preferred venue for meetings & conferences.', SortOrder: 20 }
    ],
    TravelCateringMenus: [
      { Id: 1, Name: 'Finger Food', Description: 'Per Person', Items: ['Mini sandwiches (assorted)', 'Chicken tikka skewers', 'Falafel with tahini dip', 'Mini quiche (vegetable/cheese)', 'Stuffed vine leaves', 'Seasonal fruit skewers', 'Mini desserts (assorted)'], SortOrder: 1 },
      { Id: 2, Name: 'One Coffee Break', Description: 'Per Person', Items: ['Assorted mini pastries', 'Freshly baked cookies', 'Seasonal sliced fruits', 'Nuts selection', 'Juices (2 options)', 'Arabic coffee & dates', 'Tea & coffee station'], SortOrder: 2 },
      { Id: 3, Name: 'Two Coffee Breaks', Description: 'Per Person', Items: ['Coffee Break 1: Mini muffins, Danish pastries, Fruit skewers, Juices (2 options), Tea & coffee station', 'Coffee Break 2: Mini sandwiches, Assorted cookies, Seasonal fruits, Nuts selection, Tea & coffee station'], SortOrder: 3 }
    ],
    TravelSustainabilityMetrics: [
      { Id: 1, Icon: 'CloudWeather', Value: '2,850 tCO₂', Label: 'CO₂ Offset (YTD)', DeltaLabel: '↑ 18% vs last year', SortOrder: 1 },
      { Id: 2, Icon: 'Leaf', Value: '1,250', Label: 'Trees Planted', DeltaLabel: '↑ 22% vs last year', SortOrder: 2 },
      { Id: 3, Icon: 'DrillDown', Value: '3.6M', Label: 'Liters of Water Saved', DeltaLabel: '↑ 15% vs last year', SortOrder: 3 },
      { Id: 4, Icon: 'LightningBolt', Value: '4,200 kWh', Label: 'Energy Saved', DeltaLabel: '↑ 20% vs last year', SortOrder: 4 }
    ],
    TravelServicesTeam: [
      { Id: 1, Name: 'Abrar Syed', Role: 'Manager, Travel Services', Email: 'abrar.syed@rsg.com', Phone: '+966 12 345 0000', SortOrder: 1 },
      { Id: 2, Name: 'Elaf', Role: 'Specialist, Travel Services', Email: 'elaf@rsg.com', Phone: '+966 12 345 0000', SortOrder: 2 },
      { Id: 3, Name: 'Sejid', Role: 'Specialist, Travel Services', Email: 'sejid@rsg.com', Phone: '+966 12 345 0000', SortOrder: 3 },
      { Id: 4, Name: 'Salwa', Role: 'Coordinator, Travel Services', Email: 'salwa@rsg.com', Phone: '+966 12 345 0000', SortOrder: 4 }
    ],
    TravelTestimonials: [
      { Id: 1, Quote: 'Seamless booking, clear policies and excellent support. Travel Services makes every trip stress-free.', Name: 'Ahmed Alghamdi', Role: 'Project Manager', SortOrder: 1 },
      { Id: 2, Quote: 'The Travel Care team is incredible. They are always there when you need them most.', Name: 'Sarah Khan', Role: 'Regional Director', SortOrder: 2 },
      { Id: 3, Quote: 'Wellness Beyond Office offers are fantastic! A perfect way to recharge and spend quality time with family.', Name: 'Fahad Alotaibi', Role: 'Senior Engineer', SortOrder: 3 }
    ]
  };

  // Seed ~60 days of page-view activity for the analytics chart / top-content table.
  const users = ['sandeep', 'fatima.ali', 'tom.becker', 'john.doe', 'priya.singh'];
  const refs = ['/home', '/policies', '/resources', '/faqs', '/promotions'];
  for (let d = 59; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000);
    const count = 3 + Math.round(Math.random() * 10) + (date.getDay() === 0 || date.getDay() === 6 ? -2 : 0);
    for (let i = 0; i < Math.max(1, count); i++) {
      store.TravelHubPageViews.push({
        Title: `PageView-${date.toISOString()}`,
        EventDateTime: new Date(date.getTime() + i * 60000).toISOString(),
        UserLoginName: users[Math.floor(Math.random() * users.length)],
        EventType: 'PageView',
        ItemReference: refs[Math.floor(Math.random() * refs.length)]
      });
    }
  }

  return store;
}

/**
 * SAP Concur page content and Dashboard analytics are single aggregate
 * editorial objects (not list rows), so — like `mockGroupMembers` — they sit
 * outside `IMockStore` rather than as one-row "lists".
 */
export const mockSapConcurInfo: ISapConcurInfo = {
  systemStatus: { status: 'Operational', lastUpdated: '12 May 2024, 10:30 AM (GMT+3)', message: 'All SAP Concur services are running normally.' },
  popularTopics: [
    { label: 'How to Book Travel' }, { label: 'How to Create an Expense Report' }, { label: 'How to Upload Receipts' },
    { label: 'Company Card Integration' }, { label: 'Approval Workflow' }, { label: 'Travel Policy Compliance' }
  ],
  trainingResources: [
    { icon: 'Document', title: 'SAP Concur Basics', description: 'New user? Start here.' },
    { icon: 'Megaphone', title: 'Booking Travel', description: 'Learn how to book flights, hotels and more.' },
    { icon: 'ReceiptForecast', title: 'Expense Management', description: 'Create reports and manage expenses.' },
    { icon: 'Waffle', title: 'Approvals', description: 'Approve travel and expense reports.' },
    { icon: 'Settings', title: 'Admin Resources', description: 'Tools and guides for administrators.' }
  ],
  stats: { trips: 3, expenses: 12, approvals: 5 }
};

export const mockDashboardAnalytics: IDashboardAnalytics = {
  kpis: [
    { icon: 'Money', label: 'Total Spend', value: 'SAR 28.4M', compareLabel: 'vs Mar 1 – Mar 31, 2024', deltaLabel: '▲ 8.6%', deltaDirection: 'up' },
    { icon: 'Savings', label: 'Total Savings', value: 'SAR 3.7M', compareLabel: 'vs Mar 1 – Mar 31, 2024', deltaLabel: '▲ 12.4%', deltaDirection: 'up' },
    { icon: 'Leaf', label: 'CO₂ Emissions Saved', value: '312 tCO₂e', compareLabel: 'vs Mar 1 – Mar 31, 2024', deltaLabel: '▲ 14.7%', deltaDirection: 'up' },
    { icon: 'Devices3', label: 'SAP Concur Adoption', value: '92%', compareLabel: 'vs Mar 1 – Mar 31, 2024', deltaLabel: '▲ 5 pp', deltaDirection: 'up' },
    { icon: 'FavoriteStar', label: 'Traveler Satisfaction', value: '4.6/5', compareLabel: 'vs Mar 1 – Mar 31, 2024', deltaLabel: '▲ 0.3', deltaDirection: 'up' }
  ],
  spendSeries: [
    { label: "Nov '23", spend: 21, savings: 21 }, { label: "Dec '23", spend: 19, savings: 23 }, { label: "Jan '24", spend: 21, savings: 26 },
    { label: "Feb '24", spend: 21, savings: 27 }, { label: "Mar '24", spend: 22, savings: 24 }, { label: "Apr '24", spend: 26, savings: 27 }
  ],
  spendTotal: 'SAR 28.4M',
  categoryBreakdown: [
    { label: 'Air', amount: 12.8, pct: 45, color: 'var(--th-secondary)' },
    { label: 'Hotel', amount: 8.6, pct: 30, color: 'var(--th-accent-blue)' },
    { label: 'Ground Transportation', amount: 3.2, pct: 11, color: 'var(--th-primary)' },
    { label: 'Meals & Incidentals', amount: 2.1, pct: 7, color: 'var(--th-accent-teal)' },
    { label: 'Other', amount: 1.7, pct: 6, color: 'var(--th-accent-red)' },
    { label: 'Visa & Fees', amount: 0.1, pct: 1, color: 'var(--th-text-muted)' }
  ],
  topDestinations: [
    { label: 'Jeddah', amount: 5.6 }, { label: 'Riyadh', amount: 4.8 }, { label: 'Dubai', amount: 3.2 }, { label: 'Dammam', amount: 2.6 },
    { label: 'Abha', amount: 1.5 }, { label: 'London', amount: 1.3 }, { label: 'Doha', amount: 1.1 }
  ],
  complianceBreakdown: [
    { label: 'Compliant', pct: 87, amount: 24.7, color: 'var(--th-secondary)' },
    { label: 'Non-Compliant', pct: 10, amount: 2.8, color: 'var(--th-accent-red)' },
    { label: 'Pending Review', pct: 3, amount: 0.9, color: 'var(--th-text-muted)' }
  ],
  compliancePct: 87,
  complianceNote: 'Great job! Your compliance improved by 6 pp compared to last month.',
  businessUnitRows: [
    { unit: 'Development', spend: 8.6, pctOfTotal: 30, vsLastMonthLabel: '▲ 9.3%', vsLastMonthUp: true },
    { unit: 'Operations', spend: 6.4, pctOfTotal: 22, vsLastMonthLabel: '▲ 7.1%', vsLastMonthUp: true },
    { unit: 'Corporate Services', spend: 5.1, pctOfTotal: 18, vsLastMonthLabel: '▲ 5.2%', vsLastMonthUp: true },
    { unit: 'Finance & Accounting', spend: 3.2, pctOfTotal: 11, vsLastMonthLabel: '▼ 1.4%', vsLastMonthUp: false },
    { unit: 'Marketing & Comm.', spend: 2.1, pctOfTotal: 7, vsLastMonthLabel: '▲ 3.6%', vsLastMonthUp: true },
    { unit: 'Other', spend: 3.0, pctOfTotal: 12, vsLastMonthLabel: '▲ 6.8%', vsLastMonthUp: true }
  ],
  travelerExperience: [
    { icon: 'Contact', label: 'Bookings Made', value: '1,248', deltaLabel: '▲ 10.2%', deltaUp: true },
    { icon: 'Suitcase', label: 'Trips Completed', value: '1,102', deltaLabel: '▲ 8.7%', deltaUp: true },
    { icon: 'Clock', label: 'Avg. Booking Lead Time', value: '12 Days', deltaLabel: '▼ 1 Day', deltaUp: false },
    { icon: 'EmojiNeutral', label: 'NPS Score', value: '57', deltaLabel: '▲ 6 pts', deltaUp: true }
  ],
  topRoutes: [
    { route: 'Riyadh – Jeddah', spend: 2.9, trips: 412, avgTicket: 1210 },
    { route: 'Riyadh – Dubai', spend: 2.1, trips: 256, avgTicket: 1980 },
    { route: 'Jeddah – Dubai', spend: 1.7, trips: 198, avgTicket: 1950 },
    { route: 'Riyadh – London', spend: 1.6, trips: 143, avgTicket: 4520 },
    { route: 'Jeddah – Riyadh', spend: 1.4, trips: 365, avgTicket: 980 }
  ],
  sustainabilityImpact: [
    { icon: 'Leaf', value: '312 tCO₂e', label: 'Emissions Saved', deltaLabel: '▲ 14.7%' },
    { icon: 'Tree', value: '1,248', label: 'Trees Equivalent Planted', deltaLabel: '▲ 8.2%' },
    { icon: 'Gas', value: '98,760 L', label: 'Fuel Saved', deltaLabel: '▲ 11.3%' },
    { icon: 'Recycling', value: '64%', label: 'Sustainable Hotels Booked', deltaLabel: '▲ 9 pp' }
  ]
};

export const mockGroupMembers: Record<string, { Id: number; Title: string; Email: string; LoginName: string }[]> = {
  'Travel Hub Admins': [
    { Id: 1, Title: 'Sarah Ahmed', Email: 'sarah.ahmed@example.com', LoginName: 'sarah.ahmed' },
    { Id: 2, Title: 'Omar Khalid', Email: 'omar.khalid@example.com', LoginName: 'omar.khalid' }
  ],
  'Travel Hub Contributors': [
    { Id: 3, Title: 'John Doe', Email: 'john.doe@example.com', LoginName: 'john.doe' },
    { Id: 4, Title: 'Priya Singh', Email: 'priya.singh@example.com', LoginName: 'priya.singh' },
    { Id: 5, Title: 'Ahmed Nasser', Email: 'ahmed.nasser@example.com', LoginName: 'ahmed.nasser' }
  ],
  'Travel Hub Visitors': [
    { Id: 6, Title: 'Sandeep Kumar', Email: 'sandeep@example.com', LoginName: 'sandeep' },
    { Id: 7, Title: 'Fatima Ali', Email: 'fatima.ali@example.com', LoginName: 'fatima.ali' }
  ]
};
