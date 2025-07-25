import React, { useState, useCallback } from 'react';
import { VolunteerInfo } from '../types/volunteer';
import { describeVolunteerByPhone, updateTeamLeaderPhone } from '../api/volunteerApi';
import './VolunteerPhoneManager.css';

interface VolunteerPhoneManagerProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const VolunteerPhoneManager: React.FC<VolunteerPhoneManagerProps> = ({
  onSuccess,
  onError,
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [volunteerInfo, setVolunteerInfo] = useState<VolunteerInfo | null>(null);
  const [newTeamLeaderPhone, setNewTeamLeaderPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNoUserMessage, setShowNoUserMessage] = useState(false);

  // 固定提示信息
  const NO_USER_MESSAGE = '未找到该手机号对应的志愿者信息，请确认手机号是否正确';

  /**
   * 手机号输入处理
   */
  const onPhoneInput = useCallback(async (phone: string) => {
    setPhoneInput(phone);
    setVolunteerInfo(null);
    setShowNoUserMessage(false);
    setNewTeamLeaderPhone('');

    // 如果手机号为空或长度不足，不进行查询
    if (!phone || phone.length < 11) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await describeVolunteerByPhone({ phone });
      
      if (response.success && response.data) {
        // 有用户信息，在界面显示
        setVolunteerInfo(response.data);
        setNewTeamLeaderPhone(response.data.teamLeaderPhone || '');
        setShowNoUserMessage(false);
      } else {
        // 没有用户信息，显示固定提示
        setVolunteerInfo(null);
        setShowNoUserMessage(true);
      }
    } catch (error) {
      console.error('查询用户信息失败:', error);
      onError?.('查询用户信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  /**
   * 提交修改领队手机号
   */
  const handleSubmit = useCallback(async () => {
    if (!volunteerInfo) {
      onError?.('请先查询到有效的志愿者信息');
      return;
    }

    if (!newTeamLeaderPhone) {
      onError?.('请输入新的领队手机号');
      return;
    }

    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(newTeamLeaderPhone)) {
      onError?.('请输入正确的手机号格式');
      return;
    }

    setSubmitting(true);

    try {
      const response = await updateTeamLeaderPhone({
        volunteerId: volunteerInfo.id,
        newTeamLeaderPhone,
      });

      if (response.success) {
        onSuccess?.('领队手机号修改成功');
        // 更新本地显示的信息
        setVolunteerInfo(prev => prev ? {
          ...prev,
          teamLeaderPhone: newTeamLeaderPhone,
          updateTime: new Date().toISOString(),
        } : null);
      } else {
        onError?.(response.message || '修改失败');
      }
    } catch (error) {
      console.error('修改领队手机号失败:', error);
      onError?.('修改失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  }, [volunteerInfo, newTeamLeaderPhone, onSuccess, onError]);

  return (
    <div className="volunteer-phone-manager">
      <div className="form-section">
        <h3>志愿者信息查询</h3>
        
        {/* 手机号输入 */}
        <div className="input-group">
          <label htmlFor="phone-input">手机号：</label>
          <input
            id="phone-input"
            type="tel"
            value={phoneInput}
            onChange={(e) => onPhoneInput(e.target.value)}
            placeholder="请输入手机号"
            maxLength={11}
            disabled={loading}
          />
          {loading && <span className="loading-text">查询中...</span>}
        </div>

        {/* 用户信息显示 */}
        {volunteerInfo && (
          <div className="user-info">
            <h4>志愿者信息</h4>
            <div className="info-item">
              <span className="label">姓名：</span>
              <span className="value">{volunteerInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="label">手机号：</span>
              <span className="value">{volunteerInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">邮箱：</span>
              <span className="value">{volunteerInfo.email || '未设置'}</span>
            </div>
            <div className="info-item">
              <span className="label">状态：</span>
              <span className="value">
                {volunteerInfo.status === 'active' ? '活跃' : '非活跃'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">当前领队手机号：</span>
              <span className="value">{volunteerInfo.teamLeaderPhone || '未设置'}</span>
            </div>
          </div>
        )}

        {/* 无用户信息提示 */}
        {showNoUserMessage && (
          <div className="no-user-message">
            <p>{NO_USER_MESSAGE}</p>
          </div>
        )}

        {/* 修改领队手机号 */}
        {volunteerInfo && (
          <div className="update-section">
            <h4>修改领队手机号</h4>
            <div className="input-group">
              <label htmlFor="team-leader-phone">新领队手机号：</label>
              <input
                id="team-leader-phone"
                type="tel"
                value={newTeamLeaderPhone}
                onChange={(e) => setNewTeamLeaderPhone(e.target.value)}
                placeholder="请输入新的领队手机号"
                maxLength={11}
                disabled={submitting}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !newTeamLeaderPhone}
              className="submit-button"
            >
              {submitting ? '提交中...' : '提交修改'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerPhoneManager;
