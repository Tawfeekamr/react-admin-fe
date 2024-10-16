export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  jwtToken: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  getUser: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export interface LinkAttribute {
  name: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkItem {
  id: number;
  attributes: LinkAttribute;
}

export type LinkItemArray = LinkItem[];

export interface ApprovalRequest {
  id: number;
  attributes: {
    date: string;
    type: string;
    message: string;
    data_id: string;
    createdAt: string;
    updatedAt: string;
    entery: Entry;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApprovalResponse {
  data: ApprovalRequestArray;
  meta: {
    pagination: PaginationMeta;
  };
}

export interface EntryData {
  id: number;
  attributes: {
    upload_date: string | Date;
    name: string;
    approved: boolean;
    reject_reason: string | null;
    processed: boolean;
    createdAt: string;
    updatedAt: string;
    uuid: string;
    approval_send: string | null;
    path?: string;
  };
}

export interface Entry {
  data: EntryData;
}

export interface IFileData {
  id: number;
  attributes: {
    upload_date: string | Date;
    name: string;
    approved: boolean;
    reject_reason: string | null;
    processed: boolean;
    createdAt: string;
    updatedAt: string;
    uuid: string;
    approval_send: boolean;
  };
}

export type ApprovalRequestArray = ApprovalRequest[];


export interface IApproval {
  id: number;
  attributes: {
    createdAt: string;
    data_id: string;
    date: string;
    entery: {
      data: EntryData
    }
    message: string;
    path?: string;
    type:string;
    updatedAt: string;
  };
}