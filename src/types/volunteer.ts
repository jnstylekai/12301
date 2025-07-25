// 志愿者相关类型定义

export interface VolunteerInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  teamLeaderPhone?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

export interface VolunteerQueryRequest {
  phone: string;
}

export interface VolunteerQueryResponse {
  success: boolean;
  data?: VolunteerInfo;
  message: string;
}

export interface UpdateTeamLeaderPhoneRequest {
  volunteerId: string;
  newTeamLeaderPhone: string;
}

export interface UpdateTeamLeaderPhoneResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}
