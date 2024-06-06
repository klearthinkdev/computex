export interface Feedback {
  _id: { $oid: string };
  experience: number;
  speed_and_accuracy: number;
  user_interface: number;
  business_comm: number;
  exhibitions: boolean;
  potential_revenue: number;
  email: string | null;
  create_account: string;
  create_time: { $date: Date };
}

export interface FeedbackGroup {
  create_account: string;
  experience_total: number;
  speed_and_accuracy_total: number;
  user_interface_total: number;
  business_comm_total: number;
  exhibitions_total: number;
  potential_revenue_total: number;
  feedback_list: Array<Feedback>;
}

export const QUESTIONS = [
  '您對於 AI 即時翻譯助手的 使用體驗 感到滿意嗎？',
  '您對於 AI 即時翻譯助手的 速度與準確度 滿意嗎？',
  '您認為 AI 即時翻譯助手的 介面操作 是否簡便易用？',
  '您同意 AI 即時翻譯助手有助於 商洽溝通 嗎？',
  '整體來說，您覺得 AI 即時翻譯助手能幫助您參觀展覽嗎？',
  '透過 AI 即時翻譯助手進行商洽，能為您的公司創造多少 潛在營收？',
];
