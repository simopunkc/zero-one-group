import { News, StatusContent } from "@api/src/entity/News";
import { Topics } from "@api/src/entity/Topics";
import { RefNewsTopics } from "@api/src/entity/RefNewsTopics";

export const testNews1 = new News();
testNews1.id = 1;
testNews1.title = 'a';
testNews1.content = 'b';
testNews1.status_content = StatusContent.DELETED;

export const testNews2 = new News();
testNews2.id = 2;
testNews2.title = 'x';
testNews2.content = 'y';
testNews2.status_content = StatusContent.PUBLISHED;

export const testNews3 = new News();
testNews3.id = 3;
testNews3.title = 'e';
testNews3.content = 'f';
testNews3.status_content = StatusContent.DRAFTED;

export const testNewsPost = new News();
testNewsPost.id = 4;
testNewsPost.title = 'apa';
testNewsPost.content = 'kabar';
testNewsPost.status_content = StatusContent.DRAFTED;

export const testNewsPut = new News();
testNewsPut.id = 1;
testNewsPut.title = 'r';
testNewsPut.content = 's';
testNewsPut.status_content = StatusContent.PUBLISHED;

export const testNewsPatch = new News();
testNewsPatch.id = 2;
testNewsPatch.title = testNews2.title;
testNewsPatch.content = testNews2.content;
testNewsPatch.status_content = StatusContent.DELETED;

export const testNewsDelete = new News();
testNewsDelete.id = 3;
testNewsDelete.title = testNews3.title;
testNewsDelete.content = testNews3.content;
testNewsDelete.status_content = StatusContent.DELETED;

export const testTopics1 = new Topics();
testTopics1.id = 1;
testTopics1.category_name = 'a';

export const testTopics2 = new Topics();
testTopics2.id = 2;
testTopics2.category_name = 'b';

export const testTopicsPost = new Topics();
testTopicsPost.id = 3;
testTopicsPost.category_name = 'c';

export const testTopicsPut = new Topics();
testTopicsPut.id = 1;
testTopicsPut.category_name = 'r';

export const testRefNewsTopics1 = new RefNewsTopics();
testRefNewsTopics1.id = 1;
testRefNewsTopics1.news_id = 1;
testRefNewsTopics1.topics_id = 2;

export const testRefNewsTopics2 = new RefNewsTopics();
testRefNewsTopics2.id = 2;
testRefNewsTopics2.news_id = 2;
testRefNewsTopics2.topics_id = 2;