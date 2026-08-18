import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './ProcessSteps.module.scss';

export interface IProcessStep {
  icon: string;
  title: string;
  description?: string;
}

export interface IProcessStepsProps {
  steps: IProcessStep[];
}

/**
 * Numbered horizontal step sequence with connecting arrows — covers the
 * Visa Application Process (5 steps) and Catering's "How to Place an
 * Order" (4 steps).
 */
export const ProcessSteps: React.FC<IProcessStepsProps> = ({ steps }) => (
  <div className={styles.row}>
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={styles.step}>
          <div className={styles.iconWrap}>
            <span className={styles.number}>{i + 1}</span>
            <Icon iconName={step.icon} />
          </div>
          <h5>{step.title}</h5>
          {step.description && <p>{step.description}</p>}
        </div>
        {i < steps.length - 1 && <Icon iconName="ChevronRightSmall" className={styles.arrow} />}
      </React.Fragment>
    ))}
  </div>
);
