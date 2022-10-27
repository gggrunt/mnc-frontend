export type NewsCardData = {
    title: string;
    date: string;
    content: string;
    id: string;
};

export const article_1: NewsCardData = {
    id: '1',
    title: 'MONDAY NIGHT CUSTOMS SEASON 1',
    date: 'October 20, 2022',
    content:
        "The Monday Night Customs team is excited to announce several new and exciting changes coming with our first ever season! From new Season Power Rankings to Season Rewards, you won't want to miss this update!",
};

export const ARTICLES = [article_1];
