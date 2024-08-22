import useApi from "@/hooks/useApi.ts";
import {
  ChatHistory,
  UpdatedChatHistory,
  Ktag,
  BotData,
  BotMetaData,
} from "@/types/Bots";

type MessageUp = {
  message: string;
};

type UseBotsApiHook = {
  // Gets
  getKnowledgeTags: (clientId: string) => Promise<Ktag[]>;
  getChatHistory: (botId: string) => Promise<ChatHistory>;
  getBotData: (botId: string) => Promise<BotData>;
  getBotsList: (clientId: string) => Promise<BotData[]>;
  getKtags: (botId: string) => Promise<Ktag[]>;

  //Post
  createBot: (clientId: string, data: BotMetaData) => Promise<BotData>;
  sendMessage: (botId: string, data: MessageUp) => Promise<UpdatedChatHistory>;
  saveKtag: (botId: string, data: Ktag) => Promise<Ktag>;
  changePromptTemplateSetting: (botId: string, StaticPromptTemplate: boolean) => Promise<void>;
  changePromptTemplateValue: (botId: string, PromptTemplate: string) => Promise<void>;

  //Puts
  updateBot: (botId: string, data: BotMetaData) => Promise<BotData>;
  editKtag: (tagId: string, data: Ktag) => Promise<void>;

  //Puts
  deleteBot: (botId: string) => Promise<void>;
};

const useBotsApi = (): UseBotsApiHook => {
  const { apiPut, apiPost, apiGet, apiDelete } = useApi();

  // GETS
  const getBotsList = (clientId: string): Promise<BotData[]> => {
    const path = `api/client/bots/${clientId}`;
    return apiGet<BotData[]>(path);
  };
  const getBotData = (botId: string): Promise<BotData> => {
    const path = `api/bot/modify/${botId}`;
    return apiGet<BotData>(path);
  };
  const getChatHistory = (botId: string): Promise<ChatHistory> => {
    const path = `chat/api/${botId}`;
    return apiGet<ChatHistory>(path);
  };
  const getKnowledgeTags = (clientId: string): Promise<Ktag[]> => {
    const path = `/api/ktag/${clientId}`;
    return apiGet<Ktag[]>(path);
  };
  const getKtags = (botId: string): Promise<Ktag[]> => {
    const path = `api/ktag/${botId}`;
    return apiGet<Ktag[]>(path);
  };
  

  // POST
  const createBot = (clientId: string, data: BotMetaData): Promise<BotData> => {
    const path = `api/client/bots/${clientId}`;
    return apiPost(path, data);
  };
  const sendMessage = (
    botId: string,
    data: MessageUp
  ): Promise<UpdatedChatHistory> => {
    const path = `chat/api/${botId}`;
    return apiPost(path, data);
  };
  const saveKtag = (botId: string, data: Ktag): Promise<Ktag> => {
    const path = `api/ktag/${botId}`;
    return apiPost(path, data);
  };
  const changePromptTemplateSetting = (botId: string, StaticPromptTemplate: boolean ): Promise<void> => {
    const path = `api/bot/prompt/${botId}`;
    return apiPost(path, {value: StaticPromptTemplate});
  };
  const changePromptTemplateValue = (botId: string, PromptTemplate: string ): Promise<void> => {
    const path = `api/bot/set/prompt/${botId}`;
    return apiPost(path, {value: PromptTemplate});
  };
  // api/bot/set/prompt/{bot_id}
  // PUT
  const updateBot = (botId: string, data: BotMetaData): Promise<BotData> => {
    const path = `api/bot/modify/${botId}`;
    return apiPut(path, data);
  };
  const editKtag = (tagId: string, data: Ktag): Promise<void> => {
    const path = `api/ktag/modify/${tagId}`;
    return apiPut(path, data);
  };

  // DELETE
  const deleteBot = (botId: string): Promise<void> => {
    const path = `api/bot/modify/${botId}`;
    return apiDelete(path);
  };

  return {
    // Gets
    getKnowledgeTags,
    getChatHistory,
    getBotData,
    getBotsList,
    getKtags,

    //Post
    createBot,
    sendMessage,
    saveKtag,
    changePromptTemplateSetting,
    changePromptTemplateValue,

    //Put
    updateBot,
    editKtag,

    //Delete
    deleteBot,
  };
};

export default useBotsApi;
