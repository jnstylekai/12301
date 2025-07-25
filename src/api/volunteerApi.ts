// 志愿者相关 API 接口

import { 
  VolunteerQueryRequest, 
  VolunteerQueryResponse,
  UpdateTeamLeaderPhoneRequest,
  UpdateTeamLeaderPhoneResponse,
  ApiResponse 
} from '../types/volunteer';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

/**
 * 根据手机号查询志愿者信息
 * @param request 查询请求参数
 * @returns 志愿者信息响应
 */
export const describeVolunteerByPhone = async (
  request: VolunteerQueryRequest
): Promise<VolunteerQueryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteer/describe-by-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<VolunteerQueryResponse> = await response.json();
    
    if (result.code === 200) {
      return result.data;
    } else {
      return {
        success: false,
        message: result.message || '查询失败',
      };
    }
  } catch (error) {
    console.error('查询志愿者信息失败:', error);
    return {
      success: false,
      message: '网络请求失败，请稍后重试',
    };
  }
};

/**
 * 修改领队手机号
 * @param request 修改请求参数
 * @returns 修改结果响应
 */
export const updateTeamLeaderPhone = async (
  request: UpdateTeamLeaderPhoneRequest
): Promise<UpdateTeamLeaderPhoneResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteer/update-team-leader-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UpdateTeamLeaderPhoneResponse> = await response.json();
    
    if (result.code === 200) {
      return result.data;
    } else {
      return {
        success: false,
        message: result.message || '修改失败',
      };
    }
  } catch (error) {
    console.error('修改领队手机号失败:', error);
    return {
      success: false,
      message: '网络请求失败，请稍后重试',
    };
  }
};
