import _ from 'lodash';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import {Default, Dict} from 'tslang';

import {AbstractChonSchema, ChonComposer, ChonElementKeyType} from './schema';
import {SchemaConsumer} from './theme';

export interface ChonComponentPropsPartial<TProps extends object> {
  props?: TProps;
}

export interface ChonComponentPropsTypePartial<TType extends string> {
  type?: TType;
}

export type ChonComponentTypeType<
  TChonComponent extends AbstractChonComponent
> = TChonComponent extends ChonComponentPropsPartial<infer TProps>
  ? TProps extends ChonComponentPropsTypePartial<infer TType> ? TType : string
  : number;

export type IChonComponentProps<
  TTypeToProps = {},
  TType extends keyof TTypeToProps = keyof TTypeToProps
> = Default<TTypeToProps[TType], {}> & {
  type?: Default<TType, string>;
  className?: string;
};

export interface GeneralChonComponentProps {
  type?: string;
  className?: string;
}

export interface ChonElementProps {
  className?: string;
}

export type ChonElement = (props?: ChonElementProps) => ReactNode;

export abstract class AbstractChonComponent<
  TProps extends IChonComponentProps = GeneralChonComponentProps
> extends Component<TProps> {
  /** @internal */
  // tslint:disable-next-line:variable-name
  __elementDict: Dict<ChonElement> = {};

  name!: Chon.ComponentName;

  protected schema!: AbstractChonSchema;

  render(): ReactNode {
    return ((this.schema.composers[this.name] as any) as ChonComposer<
      this
    >).compose(
      this.__elementDict as any,
      this,
    );
  }
}

// tslint:disable-next-line:explicit-return-type
export function ChonComponent(name?: Chon.ComponentName) {
  return (ChonComponent: typeof AbstractChonComponent): any => {
    let constructor = class extends ChonComponent<any> {
      // tslint:disable-next-line:empty-line-around-blocks
      render(): ReactNode {
        return (
          <SchemaConsumer>
            {({activeSchema}) => {
              this.name = name || (ChonComponent.name as Chon.ComponentName);
              this.schema = activeSchema;
              return super.render();
            }}
          </SchemaConsumer>
        );
      }
    };

    Object.defineProperty(constructor, 'name', {
      value: ChonComponent.name,
    });

    return observer(constructor);
  };
}

// tslint:disable-next-line:explicit-return-type
export function ChonElement() {
  return <
    TChonComponent extends AbstractChonComponent,
    TKey extends ChonElementKeyType<TChonComponent>
  >(
    _target: TChonComponent,
    key: TKey,
  ): any => {
    let descriptor: TypedPropertyDescriptor<ChonElement> = {
      set(this: TChonComponent, value) {
        this.__elementDict[key] = value;
      },
    };

    return descriptor;
  };
}
