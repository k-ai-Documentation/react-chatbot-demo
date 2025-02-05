import React, { useState, useEffect, useRef } from 'react';
import { KaiStudio } from 'kaistudio-sdk-js';
import styles from './SearchChat.module.scss';

const { VITE_REACT_APP_ORGANIZATION_ID, VITE_REACT_APP_INSTANCE_ID, VITE_REACT_APP_API_KEY, VITE_REACT_APP_HOST, VITE_REACT_APP_MULTI_DOCUMENTS } = import.meta.env;

if (!((VITE_REACT_APP_ORGANIZATION_ID && VITE_REACT_APP_INSTANCE_ID && VITE_REACT_APP_API_KEY) || VITE_REACT_APP_HOST)) {
    throw new Error('Missing required environment variables');
}

interface Message {
    from: string;
    message: string;
}

interface Result {
    id: string;
    message: ResultMessage;
}

interface ResultMessage {
    action: string;
    content: string;
    datas: Datas;
    from: string;
}

interface Datas {
    answer: string;
    confidentRate: number;
    documents: Document[];
    followingQuestions: [];
    isAnswered: boolean;
    query: string;
    reason: string;
}

interface Document {
    id: string;
    name: string;
    url: string;
}

const kaiSearch = new KaiStudio({
    organizationId: VITE_REACT_APP_ORGANIZATION_ID,
    instanceId: VITE_REACT_APP_INSTANCE_ID,
    apiKey: VITE_REACT_APP_API_KEY,
});
const multiDocuments = VITE_REACT_APP_MULTI_DOCUMENTS === 'true';

const ChatApp: React.FC = () => {
    const [messageHistory, setMessageHistory] = useState<Message[]>([
      { from: 'assistance', message: 'Hello, how can I help you today?' }
    ]);
    const [userMessage, setUserMessage] = useState('');
    const [userMessageTemp, setUserMessageTemp] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('conversation');
    const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        };
    }, []);

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage: Message = { from: 'user', message: userMessage };
        setMessageHistory(prev => [...prev, newMessage]);
        setUserMessageTemp(userMessage);
        setUserMessage('');

        startLoading();

        try {
            const result = await conversation(userMessage);
            stopLoading();
            if (result) {
                setConversationId(result.id);
                processSearchResult(result.message);
                init()
            }
        } catch (error) {
            console.error(error);
            stopLoading();
        }
    };

    const conversation = async (message: string) => {
        try {
            setStep('searching');
            return await kaiSearch.chatbot().conversation(conversationId, message, multiDocuments, 'user_id');
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const startLoading = () => {
        setLoading(true);
        setLoadingPercentage(0);

        loadingIntervalRef.current = setInterval(() => {
            setLoadingPercentage((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 3) + 3 : prev));
        }, 1000);
    };

    const stopLoading = () => {
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        setLoadingPercentage(100);
        setTimeout(() => {
            setLoading(false);
            setLoadingPercentage(0);
        }, 500);
    };

    const processSearchResult = (result: ResultMessage) => {
        try {
            if (result?.action === 'SEARCH' && result.datas?.isAnswered) {
                setMessageHistory((prev) => [...prev, { from: 'assistance', message: 'Answer:' }, { from: 'assistance', message: result.content }]);

                if (result.datas.documents.length > 0) {
                    const documentMessages = result.datas.documents.map((doc: Document) => `name: ${doc.name}<br>url: <a href="${doc.url}" target="_blank">${doc.url}</a><br><br>`).join('');
                    setMessageHistory((prev) => [...prev, { from: 'assistance', message: 'Source:' }, { from: 'assistance', message: documentMessages }]);
                }
            } else {
                setMessageHistory((prev) => [...prev, { from: 'assistance', message: result.content }]);
                if (result.datas?.reason) {
                    setMessageHistory((prev) => [...prev, { from: 'assistance', message: result.datas.reason }]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const init = () => {
        setUserMessageTemp('');
        setUserMessage('');
        setStep('conversation');
    };

    return (
        <div className={styles['search-chat']}>
            <div className={styles['message-history']}>
                {messageHistory.map((message, index) => (
                    <div key={index} className={styles.message} style={{ justifyContent: message.from === 'user' ? 'flex-end' : 'flex-start' }}>
                        {message.from === 'assistance' ? (
                            <div className={styles['assistance-message']}>
                                <button className='btn-icon text-bold-14'>BOT</button>
                                <div className={styles['message-text'] + ' ' + styles['assistance-color']}>
                                    <p className='text-regular-14' dangerouslySetInnerHTML={{ __html: message.message }} />
                                </div>
                            </div>
                        ) : (
                            <div className={styles['user-message']}>
                                <div className={styles['message-text'] + ' ' + styles['user-color']}>
                                    <p className='text-regular-14'>{message.message}</p>
                                </div>
                                <button className='btn-icon text-bold-14'>USER</button>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className={styles['assistance-message']}>
                        <button className='btn-icon text-bold-14'>BOT</button>
                        <div className={styles['message-text'] + ' ' + styles['assistance-color']}>
                            <p className='text-regular-14'>Searching... {loadingPercentage}%</p>
                        </div>
                    </div>
                )}
            </div>

            {step === 'conversation' && (
                <div className={styles['input-container']}>
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        className='simple-input-h30'
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className='btn-outline-rounded-30' onClick={sendMessage}>
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
