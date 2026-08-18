import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TravelHubAdminWebPartStrings';
import { AdminApp, IAdminAppProps } from './components/AdminApp/AdminApp';

export interface ITravelHubAdminWebPartProps {
  description: string;
}

/**
 * A separate bundle from TravelHubWebPart on purpose: keeps the admin
 * table/form/chart code out of every visitor's download, and lets you place
 * this on a page that's never linked from the public nav (see README
 * "Step 4" / provisioning docs) — membership of Travel Hub Admins /
 * Contributors is the real gate either way (see UserContext + each REST
 * call's own 403 if permissions don't match).
 */
export default class TravelHubAdminWebPart extends BaseClientSideWebPart<ITravelHubAdminWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAdminAppProps> = React.createElement(AdminApp, {
      context: this.context
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
