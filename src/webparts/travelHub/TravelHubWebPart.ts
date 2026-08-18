import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TravelHubWebPartStrings';
import { App, IAppProps } from './components/App/App';

export interface ITravelHubWebPartProps {
  description: string;
}

/**
 * Renders the entire public Travel Hub SPA (Home, Book Travel, Policies,
 * Resources, FAQs, Promotions & Events, News, and the Travel Info dropdown
 * pages) into this one web part instance. Site-wide configuration (list
 * names, site URL override, theme default, hero image) lives in the
 * TravelHubConfig list, editable from the Travel Hub Admin web part's
 * Settings page — not here — so it applies everywhere without having to
 * edit every page this web part is placed on.
 */
export default class TravelHubWebPart extends BaseClientSideWebPart<ITravelHubWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps> = React.createElement(App, {
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
