import api, { UserPayload } from './api';
import { action, makeAutoObservable, observable } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import React from 'react';

enableStaticRendering(typeof window === 'undefined');

export class Store {
  @observable userData: UserPayload | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  @action fetchUserInfo = () => {
    return api
      .getMe()
      .then(this.setUserInfo)
      .catch(() => this.setUserInfo(undefined));
  };

  @action setUserInfo = (value?: UserPayload) => {
    this.userData = value;
  };
}

export const StoreContext = React.createContext<Store | null>(null);
export const useStore = (): Store | null => React.useContext(StoreContext);