const transformTextToStrong = (text: string): string => {
  const strongRE = /\*\*(.*?)\*\*/g;
  return text.replace(strongRE, '<span style="font-weight: bold;">$1</span>');
};

export default transformTextToStrong;
