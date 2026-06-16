import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categories: Record<string, { label: string; icon: string }> = {
  "朋友聊天": { label: "朋友聊天", icon: "💬" },
  "聚会互动": { label: "聚会互动", icon: "🎉" },
  "损友调侃": { label: "损友调侃", icon: "😏" },
  "开玩笑": { label: "开玩笑", icon: "😂" },
  "吐槽抱怨": { label: "吐槽抱怨", icon: "😤" },
  "第一次见面": { label: "第一次见面", icon: "☕" },
  "暧昧聊天": { label: "暧昧聊天", icon: "💕" },
  "约会互动": { label: "约会互动", icon: "🌹" },
  "微信聊天": { label: "微信聊天", icon: "📱" },
  "同事聊天": { label: "同事聊天", icon: "💼" },
  "老板交流": { label: "老板交流", icon: "👔" },
  "客户交流": { label: "客户交流", icon: "🤝" },
  "面试": { label: "面试", icon: "🎯" },
  "初次见面": { label: "初次见面", icon: "👋" },
  "破冰聊天": { label: "破冰聊天", icon: "🧊" },
  "语言交换": { label: "语言交换", icon: "🌏" },
  "社交活动": { label: "社交活动", icon: "🎊" },
};

export const sectionTypeLabels: Record<string, string> = {
  scene: "场景",
  analysis: "分析",
  tips: "技巧",
  exercise: "练习",
};
