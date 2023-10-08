import { News, StatusContent } from "@api/src/entity/News";
import { Topics } from "@api/src/entity/Topics";
import { RefNewsTopics } from "@api/src/entity/RefNewsTopics";

export const dummyNews1 = new News();
dummyNews1.id = 1;
dummyNews1.title = 'HTML and CSS code snippets that you can use for your own projects';
dummyNews1.content = 'MJT provides a comprehensive guide on creating various types of three-column layouts using CSS Grid and Flexbox.';
dummyNews1.status_content = StatusContent.DELETED;

export const dummyNews2 = new News();
dummyNews2.id = 2;
dummyNews2.title = 'Introduction to IEEE';
dummyNews2.content = 'IEEE Author Center Journals provides article templates to help you format your article and prepare a draft for peer review. The templates help with the placement of specific elements, such as the author list, and provide guidance on stylistic elements such as abbreviations and acronyms';
dummyNews2.status_content = StatusContent.PUBLISHED;

export const dummyNews3 = new News();
dummyNews3.id = 3;
dummyNews3.title = 'Introduction with W3Schools';
dummyNews3.content = 'W3Schools has a tutorial on creating a responsive three-column layout using CSS. The tutorial includes HTML and CSS code snippets that you can use for your own projects.';
dummyNews3.status_content = StatusContent.PUBLISHED;

export const dummyNews4 = new News();
dummyNews4.id = 4;
dummyNews4.title = 'Introduction with Scribbr';
dummyNews4.content = 'Scribbr provides guidelines for formatting IEEE papers, including formatting the text as two columns, in Times New Roman, 10 pt';
dummyNews4.status_content = StatusContent.DRAFTED;

export const dataDummyTopics1 = new Topics();
dataDummyTopics1.id = 1;
dataDummyTopics1.category_name = 'olahraga';

export const dataDummyTopics2 = new Topics();
dataDummyTopics2.id = 2;
dataDummyTopics2.category_name = 'berita';

export const dataDummyTopics3 = new Topics();
dataDummyTopics3.id = 3;
dataDummyTopics3.category_name = 'paper';

export const dataDummyTopics4 = new Topics();
dataDummyTopics4.id = 4;
dataDummyTopics4.category_name = 'book';

export const dataDummyRefNewsTopics1 = new RefNewsTopics();
dataDummyRefNewsTopics1.id = 1;
dataDummyRefNewsTopics1.news_id = 1;
dataDummyRefNewsTopics1.topics_id = 2;

export const dataDummyRefNewsTopics2 = new RefNewsTopics();
dataDummyRefNewsTopics1.id = 2;
dataDummyRefNewsTopics2.news_id = 2;
dataDummyRefNewsTopics2.topics_id = 2;

export const dataDummyRefNewsTopics3 = new RefNewsTopics();
dataDummyRefNewsTopics1.id = 3;
dataDummyRefNewsTopics3.news_id = 3;
dataDummyRefNewsTopics3.topics_id = 2;

export const dataDummyRefNewsTopics4 = new RefNewsTopics();
dataDummyRefNewsTopics1.id = 4;
dataDummyRefNewsTopics4.news_id = 4;
dataDummyRefNewsTopics4.topics_id = 1;
