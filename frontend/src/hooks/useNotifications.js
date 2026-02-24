import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const VAPID_PUBLIC_KEY = 'BDbbcp63KjbzUVsyhf2WeEnpDUVnCFYh8I5Qm8viBh_yyuKaQrU_Xd6FEr7FyWz7Q2FKyBXOlAV57jfq4t4wdVs';

export const useNotifications = (userToken) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    useEffect(() => {
        const checkSubscription = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                const sub = await registration.pushManager.getSubscription();
                setSubscription(sub);
                setIsSubscribed(!!sub);
            }
        };
        checkSubscription();
    }, []);

    const subscribeUser = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported');
            return;
        }

        try {
            console.log("Requesting push subscription...");
            const registration = await navigator.serviceWorker.ready;

            // Check if permission is denied
            if (Notification.permission === 'denied') {
                alert("Bạn đã chặn quyền thông báo. Vui lòng bật lại trong cài đặt trình duyệt để nhận thông báo.");
                return;
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            console.log("Subscription object:", sub);

            await axios.post(`${API_URL}/api/v1/notifications/subscribe`, sub, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            setIsSubscribed(true);
            setSubscription(sub);
            console.log('User subscribed to push notifications');
        } catch (error) {
            console.error('Failed to subscribe user:', error);
            alert("Không thể bật thông báo. Vui lòng thử lại sau.");
        }
    };

    return { isSubscribed, subscribeUser, subscription };
};
