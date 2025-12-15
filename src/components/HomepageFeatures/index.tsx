import UndrawMountain from '@site/static/img/undraw_docusaurus_mountain.svg';
import UndrawReact from '@site/static/img/undraw_docusaurus_react.svg';
import UndrawTree from '@site/static/img/undraw_docusaurus_tree.svg';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ComponentProps, ComponentType, ReactNode } from 'react';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: ComponentType<ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Live React playgrounds',
    Svg: UndrawReact,
    description: (
      <>
        Use <code>live</code> code fences in MDX to embed editable React examples. React and common
        hooks are available by default.
      </>
    ),
  },
  {
    title: 'TypeScript-first threads',
    Svg: UndrawMountain,
    description: (
      <>
        Threads are written in Markdown/MDX with TypeScript support, linting, formatting, and
        type-checking baked in.
      </>
    ),
  },
  {
    title: 'Assets in one repo',
    Svg: UndrawTree,
    description: (
      <>
        Store images, GIFs, and videos under <code>static/</code> and reference them via absolute
        paths in your docs.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
