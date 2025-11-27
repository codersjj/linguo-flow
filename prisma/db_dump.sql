--
-- PostgreSQL database dump
--

\restrict 4U7TWKh7ZsDFCkq12myiNr9exj5ahKnwYSODsY6uq9rt8LJ8nHfFh8exIzbQVbM

-- Dumped from database version 17.2
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: prisma_migration
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO prisma_migration;

--
-- Name: Stage; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Stage" AS ENUM (
    'intermediate',
    'advanced',
    'movies'
);


ALTER TYPE public."Stage" OWNER TO prisma_migration;

--
-- Name: Type; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Type" AS ENUM (
    'audio',
    'video',
    'mixed',
    'text'
);


ALTER TYPE public."Type" OWNER TO prisma_migration;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "expiresAt" timestamp(3) without time zone,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO prisma_migration;

--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    stage public."Stage" NOT NULL,
    type public."Type" NOT NULL,
    duration text NOT NULL,
    thumbnail text NOT NULL,
    "mediaUrl" text NOT NULL,
    transcript text NOT NULL,
    "textContent" text
);


ALTER TABLE public."Lesson" OWNER TO prisma_migration;

--
-- Name: Progress; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Progress" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "lastReviewedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Progress" OWNER TO prisma_migration;

--
-- Name: Progress_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Progress_id_seq" OWNER TO prisma_migration;

--
-- Name: Progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Progress_id_seq" OWNED BY public."Progress".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO prisma_migration;

--
-- Name: StudyActivity; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."StudyActivity" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    "activityType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StudyActivity" OWNER TO prisma_migration;

--
-- Name: User; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    name text,
    image text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO prisma_migration;

--
-- Name: Verification; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Verification" (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Verification" OWNER TO prisma_migration;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO prisma_migration;

--
-- Name: Progress id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Progress" ALTER COLUMN id SET DEFAULT nextval('public."Progress_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Account" (id, "userId", "accountId", "providerId", "accessToken", "refreshToken", "idToken", "expiresAt", password, "createdAt", "updatedAt") FROM stdin;
iPtVmHyLICbzV6gohwyNsZv9kwi4eiPC	9SMq1o0GRC60SicOda14k9X2gRorgWpS	9SMq1o0GRC60SicOda14k9X2gRorgWpS	credential	\N	\N	\N	\N	f9d0f541c01c4744c22a6aebad68a771:704737a12611d4761941e884a42339275100415a9d4f0e1bcbfb023c1d8f2680939345a0bd870e381a8bf87aad4499c214b79472cbe6a9645100ad5eeaf290fa	2025-11-27 01:04:35.78	2025-11-27 01:04:35.78
Ch5cUt4TXKpr6Jp4MiidyBh68t58SFHP	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	credential	\N	\N	\N	\N	059de3cb9b8c2242fcccc58bd9ae407f:3097c9fc4577d094ec17820a9c67ba683efa70e7855f96640affbc38436eb45c4cfc32d3b308a1ef4d349baf74b9cd4b1bee298fa8c148e484b8be61d80a7e61	2025-11-27 02:48:40.307	2025-11-27 02:48:40.307
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Lesson" (id, title, description, stage, type, duration, thumbnail, "mediaUrl", transcript, "textContent") FROM stdin;
0c6b035e-eb65-40dd-8448-ab05ee0654ea	Lesson 1-1 20250413-1 Do you have a date for the party yet	Do you have a date for the party yet?\r\nActually, I don't. Do you think you could help me find one?	advanced	audio	00:32	https://picsum.photos/800/450?random=1	/uploads/22a44829-4fa1-45ca-ba1b-8fb954def8bd-1  Do you have a date for the party yet.mp3	Do you have a date for the party yet?\r\nActually, I don't. Do you think you could help me find one?\r\nHmm, what kind of guys do you like?\r\nOh, I like guys who aren't too serious and who have a good sense of humor, you know, like you.\r\nOkay, what else?\r\nWell, I'd prefer someone I have something in common with, who I can talk to easily.\r\nI think I know just the guy for you. Bob Branson, do you know him?\r\nNo, I don't think so.\r\nLet me arrange for you to meet him. And you can tell me what you think.	\N
319294bb-ebbe-4f57-a585-03b4c96fb681	Lesson 1-2 20250413-2 What's the verdict	So, what's the verdict? What did you think of Bob?\r\nWell I was worried at first. Especially when I saw that he wears not one but two earrings. I thougt he might turn out to be one of those guys who are into heavy rock music and stuff like that. You know what I mean?	advanced	audio	00:37	https://picsum.photos/800/450?random=1	/uploads/a062ec06-876b-466e-be43-601132b8d74f-2  What's the verdict.mp3	So, what's the verdict? What did you think of Bob?\r\nWell I was worried at first. Especially when I saw that he wears not one but two earrings. I thougt he might turn out to be one of those guys who are into heavy rock music and stuff like that. You know what I mean?\r\nBut he's just a regular kind of guy, right?\r\nYeah, we got along really well.\r\nI just knew you like him.\r\nYeah, I do. And he's really funny. He had me lauging hysterically during dinner. I think the people sitting next to us in the restaurant thought we were crazy.\r\nSo, are you two going to get togehter again?\r\nDefinitely, in fact, we're going to a concert tomorrow night.\r\nThat' great.	\N
77e95ac0-e041-4223-a143-7517351ff094	Lesson 2-1 20250419-1 Andrea	So, have you seen Andrea lately?\r\nYeah, I see her pretty often. We work together at cafe latte.	advanced	audio	00:37	https://picsum.photos/800/450?random=1	/uploads/45e33ded-6e2b-46e1-ab28-a2dc54ce919d-1 Andrea.mp3	So, have you seen Andrea lately?\r\nYeah, I see her pretty often. We work together at cafe latte.\r\nHow is she doing? I've been meaning to call her.\r\nWell, to be honest. I've always thought she was a little difficult, but these days I find her impossible.\r\nWhat do you mean?\r\nOh, you know how she is. She has such strong ideas about everything. And if you don't agree with her, she lets you know what she thinks of you.\r\nYes, that's true. But, that's why we love her, right?\r\nYeah, I guess so. But she's changed a lot since she studied college. She talks about herself all the time. And she always manages to mention how good she is at everything she does.\r\nHmm, maybe I won't call her after all.	\N
e44f70e0-0a10-4096-a1f8-83a4483c0928	Lesson 2-2 20250419-2 Johnson	Have you met the new apartment manager?\r\nMr. Johnson? Hmm, yeah, I met him last week. He is a little strange.	advanced	audio	00:28	https://picsum.photos/800/450?random=1	/uploads/c23847cd-2e1e-4877-b426-5dad565a7f43-3  Johnson.mp3	Have you met the new apartment manager?\r\nMr. Johnson? Hmm, yeah, I met him last week. He is a little strange.\r\nYeah, he is. I'm not sure I like him. He is hard to predict. Sometimes he is pretty cheerful and talkative and the next day he doesn't even say hello. I think he must have personal problems or something.\r\nI think you're right. And have you noticed that half the time when he says he's going to do something, he never actually does it. He told me three times he'd come to fix the light in my kitchen, and he still hasn't done it.	\N
9311fd7d-5d4a-4548-ba14-75f67e95027e	Lesson 3-2 20250420-2 Money	Money\r\nOf course we are going to put money first on this list.	advanced	video	01:03	https://picsum.photos/800/450?random=1	/uploads/4cdd10db-218d-4691-8aa4-1b7d27be3053-2  Money.mp4	Money\r\nOf course we are going to put money first on this list.\r\nOtherwise we'd never hear the end of it from you guys.\r\nBut money represents more than stacks of paper with dead people on it.\r\nWomen look for how much a man earns in order to quantify the level of respect society is offering him.\r\nYep, this is the world we live in.\r\nMoney is a measurement of success, and everybody wants to be with someone who is successful.\r\nBut men judge other men by this as well, so get off your high horse. When somenone asks you what you do for a living, They're usually trying to determine if you're above or below them on an economic scale.\r\nSomething we want to make clear from the very start.\r\nMoney only impresses lazy girls.\r\nWhen a woman works hard herself, a man with money is just a bonus, not a ladder to an upgrade.\r\nIf all your partner looks for in you is money, you're bound to have an unhappy life.	\N
99304a22-af5a-4a0d-bb93-c08441fbc347	Lesson 3-1 20250420-1 A shared sense of humor	A shared sense of humor\r\nLaughter brings people together.	advanced	video	00:35	https://picsum.photos/800/450?random=1	/uploads/58e2fe47-d17e-431c-b33f-f3133840984b-2  A shared sense of humor.mp4	A shared sense of humor\r\nLaughter brings people together.\r\nSo why is this important?\r\nIt's because laughter releases endorphins in your brain.\r\nRelieving stress and makes someone feel comfortable and safe around you.\r\nBeing funny is actually a sign of intellect.\r\nNot just anybody can be funny, and not everybody finds the same things hilarious.\r\nThat's why it's such an amazing thing when you simply click with someone.\r\nWhen you're thinking the same thing, and you get each other's jokes.	\N
1a88bbee-0a3d-4650-8cae-447143df5b17	Lesson 4-1 20250426-1 James	Are you going to James's party on Saturday?\r\nOf course. James always gives the best parties. And there are always lots of interesting new people to meet.	advanced	audio	00:35	https://picsum.photos/800/450?random=1	/uploads/9a55ee63-f3fa-4602-83df-2528b43b67dd-4  James.mp3	Are you going to James's party on Saturday?\r\nOf course. James always gives the best parties. And there are always lots of interesting new people to meet.\r\nThat's true. I don't know where he manages to find them all.\r\nWell, you know what he's like. He makes friends really easily. He really likes talking to people, and he loves inviting people over.\r\nUh-huh. He invited me for dinner last Saturday. What a feast!\r\nYeah, he is a great cook too.\r\nAfter dinner, I offered to help clean up, and he told me not to worry about it. He said he'd take care of it in the morning.\r\nHe was like, it's nothing, no big deal.\r\nYep, that sounds like James.	\N
8c376973-6db0-4d35-83f0-af3a0d9a08b0	Lesson 8-2 20250511-2 As a camp counselor	As a camp counselor, It's difficult to find a way to get through to kids with problems and win their trust.	advanced	audio	00:31	https://picsum.photos/800/450?random=1	/uploads/ead3727f-3acc-4845-9456-e2fd01b08114-15 As a camp counselor.mp3	As a camp counselor, It's difficult to find a way to get through to kids with problems and win their trust.\r\nSometimes kids are very suspicious and find it hard to trust an adult, even a young adult.\r\nSo getting them to open up is the hardest part.\r\nOnce you've done that, they almost become different people.\r\nOne of the things I find most rewarding is seeing kids develop confidence and a sense of self-worth.\r\nIt's especially great to see that happen in a kid who started out the summer with low self-esteem.	\N
e31a7461-889b-447a-bf55-33693a3c2082	Lesson 4-2 20250426-2 Confidence	Confidence\r\nWomen want someone who can take initiative, who trusts his abilities.	advanced	video	01:04	https://picsum.photos/800/450?random=1	/uploads/e45cc242-9bc6-47b9-ad44-984816bccec2-2  Confidence.mp4	Confidence\r\nWomen want someone who can take initiative, who trusts his abilities.\r\nIf you don't believe in yourself, how do you expect others to do it?\r\nConfidence is one of the most attractive traits in a partner.\r\nThis state is usually generated by a track record of successful performances.\r\nIt's a lot easier to look confident about public speaking, when it's your twentieth talk on the topic, and the previous ones were received successfully.\r\nA confident man is someone who knows success is within his reach.\r\nIt's easy to lack it when you've never done anything like this.\r\nIf you're tired of looking down on yourself, if you're not happy with the way things are going for you or where your life is going. It might be time to slap yourself back to reality.\r\nIf you don't change, your life'll only get worse.\r\nYou need to build yourself up from the ground if you're going to become the man or woman who's going to escape this trap you've built yourself into.	\N
d1ac8be4-31f8-41cb-af08-e3281196bd9f	Lesson 5-1 20250501-1 Princess Diana	Well, as far as I'm concerned.\r\nPrincess Diana has to be one of the most important public figures in recent history.	advanced	audio	00:27	https://picsum.photos/800/450?random=1	/uploads/5253f04b-3250-4483-9b0c-2c26689d555f-8 Princess  Diana.mp3	Well, as far as I'm concerned.\r\nPrincess Diana has to be one of the most important public figures in recent history.\r\nHer death was such a tragedy. \r\nWhile she was living, she used her status to make the world a better place.\r\nI mean, she could have just sat back and had a fabulous life, but she tackled problems like AIDS and land mines, and really brought them to people's attention.\r\nThat's why I feel she was such an important figure.	\N
87eb9f19-3e28-44f1-9169-399671b263e0	Lesson 5-2 20250501-2 Bill Gates	Well, I think Bill Gates is probably the most important person I can think of.\r\nHis company Microsoft has changed the way computers work and made computers available to everybody.	advanced	audio	00:17	https://picsum.photos/800/450?random=1	/uploads/720fe295-51ee-4cb8-93a9-8f935fe86925-9 Bill Gates.mp3	Well, I think Bill Gates is probably the most important person I can think of.\r\nHis company Microsoft has changed the way computers work and made computers available to everybody.\r\nAnd the Windows software that Microsoft developed was really a turning point in the development of computers in the twentieth century.	\N
6604b580-04a6-4a2a-8788-d415f1926450	Lesson 6-1 20250502-1 Good news	Good news! I found a summer job!\r\nThat's great! Anything interesting?	advanced	audio	00:26	https://picsum.photos/800/450?random=1	/uploads/a54bd434-5e69-4427-946d-4964f9a726d4-1 Good news.mp3	Good news! I found a summer job!\r\nThat's great! Anything interesting?\r\nYes, working at an amusement park, doesn't that sound fantastic?\r\nSure, it does.\r\nSo, have you found anything?\r\nNothing yet, but I've got a couple of leads.\r\nOne is working as an intern for a record company, mostly answering phones.\r\nOr I can get a landscaping job again.\r\nBeing an intern sounds more interesting than landscaping, and it's probably not as hard.\r\nYeah, but a landscaper earns more money than an intern, and you get a great tan.	\N
70a846cc-03f8-49c4-8f4a-590a4d668cd5	Lesson 6-2 20250502-2 So what will you be doing	So what will you be doing at the amusement park exactly?\r\nActually, I'll have two jobs. First, I'll be working at a place called Children's World. They have all kinds of interesting games and educational activities for young kids. I have to go to a training program for three days before I start to find out how everything works.	advanced	audio	00:48	https://picsum.photos/800/450?random=1	/uploads/43b47fb8-81d7-4676-94b9-d392340be3f1-2 So what will you be doing.mp3	So what will you be doing at the amusement park exactly?\r\n\r\nActually, I'll have two jobs. First, I'll be working at a place called Children's World. They have all kinds of interesting games and educational activities for young kids. I have to go to a training program for three days before I start to find out how everything works.\r\n\r\nThree days? Wow, the equipment must be pretty high-tech.\r\n\r\nOh, it is. A lot of computers and interesting devices. It's just the kind of stuff that kids love.\r\n\r\nWell, it sounds like the perfect job for you. I know how much you love kids. So what's your other job?\r\n\r\nWell, I'll also be one of the people who walks around the park greeting people.\r\n\r\nDo you mean you'll have to dress up in a costume?\r\n\r\nYes, as a cartoon character. Haha, I know, I know. It sounds silly, and it's certainly not as rewarding as working in Children's World, but it's part of the job.	\N
c707005e-03bc-4c5a-a6a0-f60948ca6578	Lesson 7-1 20250510-1 Did you find a summer job	Paul, did you find a summer job yet?\r\nYeah, I'm working in a restaurant.	advanced	audio	00:28	https://picsum.photos/800/450?random=1	/uploads/47b58918-8a9a-466e-9227-e9ee8d674436-12 Did you find a summer job (1).mp3	Paul, did you find a summer job yet?\r\nYeah, I'm working in a restaurant.\r\nOh, how's it going?\r\nOh, the money's not bad.\r\nWhat are you doing? Are you waiting tables?\r\nI wish. No, I'm working in the kitchen, I cut up stuff for the chef, vegetables and meat and things.\r\nI also wash the dishes.\r\nOh, yuck.\r\nYeah, It's pretty hard work. I didn't realize how hot it is in a restaurant kitchen until I took this job.\r\nSo why don't you quit?\r\nI'd love to, but I need the money.	\N
95c45312-bf7e-40d3-a215-ef368475e7d9	Lesson 7-2 20250510-2 What kind of Job	So what kind of the job did you find for the summer?\r\nI'm working for a marketing company, I'm doing telephone marketing.	advanced	audio	00:30	https://picsum.photos/800/450?random=1	/uploads/1e770e82-5a1d-4dda-9702-0d81304ecd60-13 What kind of Job.mp3	So what kind of the job did you find for the summer?\r\nI'm working for a marketing company, I'm doing telephone marketing.\r\nOh, so you are one of those people who drives me crazy by calling me up and trying to persuade me to buy something that I have absolutely no need for.\r\nExactly.\r\nDo you like it?\r\nBelieve it or not, I do. It's mostly a bunch of students working there, and we have a lot of fun when we're not making calls.\r\nIt's really easy too, since we just have to read from a script.\r\nAre you doing this full-time?\r\nYes, but I work from two in the afternoon into eleven at night. So I get to sleep as late as I want to in the morning.	\N
a3ebb5cf-b423-402b-9550-c257cef935b3	Lesson 8-1 20250511-1 Maybe the biggest challenge	Maybe the biggest challenge for me is listening to people talk about their problems all day.	advanced	audio	00:28	https://picsum.photos/800/450?random=1	/uploads/c5886e3b-cfa7-4f77-81aa-e739ff59f908-14 Maybe the biggest challenge.mp3	Maybe the biggest challenge for me is listening to people talk about their problems all day.\r\nAt the end of the day, I'm usually pretty worn out.\r\nAt times, it can be depressing as well.\r\nOn the other hand, I do see patients making real progress.\r\nIt's great to see someone really turn their life around and get on top of a problem that they never thought they could deal with.	\N
dbd7bfee-a4c7-4d5f-8475-400f82e19e45	Lesson 8-3 20250511-3 It sounds pretty obvious	It sounds pretty obvious.\r\nBut in my job, the biggest challenge is going into a burning building that's full of smoke when you can barely see a few inches in front of you.	advanced	audio	00:35	https://picsum.photos/800/450?random=1	/uploads/e923b0f5-0324-44ba-8c1d-b637ff75dc11-16 It sounds pretty obvious.mp3	It sounds pretty obvious.\r\nBut in my job, the biggest challenge is going into a burning building that's full of smoke when you can barely see a few inches in front of you.\r\nIt's really difficult, especially when you know there are people in there, and it's your job to get them out.\r\nOnce you do get someone out safely. Then you feel really great. And you forget about how dangerous the work is.	\N
a0b16672-9bb0-4ba7-afac-eb83dc3fe60d	Lesson 9-1 20250517-1 What an awful story	What an awful story, a couple was sailing their yacht from Hawaii to Mexico. While they were crossing the Pacific, their boat hit a whale and sank.\r\nIs that true? What happened to the whale?	advanced	audio	00:44	https://picsum.photos/800/450?random=1	/uploads/6d1e1325-b3b3-458c-a18d-17124a3a1a40-21 What an awful story.mp3	What an awful story, a couple was sailing their yacht from Hawaii to Mexico. While they were crossing the Pacific, their boat hit a whale and sank.\r\nIs that true? What happened to the whale?\r\nIt doesn't say. Oh, and here's another one. A guy in Los Angeles was robbing a bank, but as he was escaping, he got caught in the revolving door.\r\nI guess it was his first bank robbery.\r\nYeah, Oh, and listen to this. Some guy got locked out of his house, so he tried to get in through the chimney.\r\nDon't tell me he got stuck in the chimney.\r\nExactly, and he was still trying to get out two days later when the police rescued him.	\N
f98a7142-5bcd-4072-b68c-4f295950cb8a	Lesson 9-2 20250517-2 A man considered himself	A man who considered himself a snake charmer was strangled to death on Sunday by a three-and-a-half-meter boa constrictor in a town in Thailand.  	advanced	audio	00:21	https://picsum.photos/800/450?random=1	/uploads/da06669d-f7ff-42ce-bba9-1fedb35685f1-22 A man considered himself.mp3	A man who considered himself a snake charmer was strangled to death on Sunday by a three-and-a-half-meter boa constrictor in a town in Thailand.\r\nIt seems that the man rushed to see the giant snake after friends told him the serpent was seen beside one of the town's main roads.\r\nThe snake charmer put it around his neck, while he and his friends were walking home, the snake strangled him to death.	\N
b0de2467-29f4-47c8-99fa-b7194b3f9d7a	Lesson 10-1 20250518-1 Someone stole my wallet	Someone stole my wallet last night.\r\nOh, no, what happened?	advanced	audio	00:22	https://picsum.photos/800/450?random=1	/uploads/9d4a48da-86ff-4c9c-aca7-c5a8063c0183-1  Someone stole my wallet.mp3	Someone stole my wallet last night.\r\nOh, no, what happened?\r\nWell, I was working out and I had put my stuff in my locker just like I always do. When I came back, someone had stolen my wallet. I guess I'd forgotten to lock the locker.\r\nI'm sorry, that's terrible. Did you lose much money?\r\nOnly about twenty dollars, but I lost my credit card and my driver's license. What a pain.	\N
5a1e0e99-f7f6-4747-9da8-a6301f45366d	Lesson 10-2 20250518-2 That reminds me of	Hmm, that reminds me of when I had my purse stolen last year.\r\nReally? What happened?	advanced	audio	01:00	https://picsum.photos/800/450?random=1	/uploads/fe605525-cc3e-4d5c-bf01-dc41221aa95a-2  That reminds me of ....mp3	Hmm, that reminds me of when I had my purse stolen last year.\r\nReally? What happened?\r\nWell, it was when I was in Belgium. I was on my way to the airport, so I was standing on the side of the road with my bags. Trying to figure out the bus schedule. Anyway, this bunch of guys came by and asked if they could help me. They spoke very broken English, and I couldn't really understand what they were saying. I really just wanted them to leave me alone. Finally, they left, and when I looked down, I realized my purse had disappeared. It had my wallet in it with all my traveler's checks and my money and my credit card. Well, luckily I'd put my airline ticket and my passport in one of my carry-on bags.\r\nHow awful! So what did you do?\r\nWell, first I screamed at the top of my lungs and tried to run after the guys but they were long gone, then, this sounds really corny, I did just what I'd seen people do on TV. I called my credit card company.\r\nWere they helpful?\r\nThey were lifesavers in no time at all. They'd given me new traveler's checks and a new credit card and sent me on my way.	\N
b3348c61-9544-41dc-9b40-e6f09ba59c0d	Lesson 1-1 20250111-1 Oh I'm really sorry	Oh, I'm really sorry. Are you OK?\r\nI'm fine. But I'm not very good at this.	intermediate	audio	00:42	https://picsum.photos/800/450?random=1	/uploads/53838d39-3175-4cc6-9875-837abdfe4922-1 Oh I'm really sorry.mp3	Oh, I'm really sorry. Are you OK?\r\nI'm fine. But I'm not very good at this.\r\nNeither am I. Say are you from South America?\r\nYes, I am originally. I was born in Argentina.\r\nDid you grow up there?\r\nYes, I did. But my family moved here eight years ago when I was in high school.\r\nAnd where did you learn to rollerblade?\r\nHere in the park, this is only my second time.\r\nWell, it's my first time. Can you give me some lessons?\r\nSure, just follow me.\r\nBy the way, my name is Ted.\r\nAnd I'm Anna, nice to meet you.	\N
82691e48-d625-40a0-9d62-7b2d0357b347	Lesson 1-2 20250111-2 hey hey that was fun	Hey, hey, that was fun. Thanks for the lesson.\r\nNo problem. So tell me a little about yourself. What do you do?	intermediate	audio	00:33	https://picsum.photos/800/450?random=1	/uploads/73465ee6-8ca7-4e2b-b791-02c8706eff95-2 hey hey that was fun.mp3	Hey, hey, that was fun. Thanks for the lesson.\r\nNo problem. So tell me a little about yourself. What do you do?\r\nI work in a travel agency.\r\nReally? What do you do there?\r\nI'm in charge of their computers.\r\nOh, So you are a computer specialist.\r\nWell, sort of. Yeah, I guess so.\r\nThat's great! Then maybe you can give me some help with the computer course I'm taking.\r\nOh, sure. But only If you promise to give me some more rollerblading lessons.\r\nUh-huh. It's a deal.	\N
f30d28e4-42a8-4926-af7e-7350f2d6448a	Lesson 1 20250802	My name is Mary Alice Young.	movies	video	02:36	https://picsum.photos/800/450?random=1	/uploads/4f244c37-f9eb-4375-acee-068d4dc2783f-20250802-1.mp4	My name is Mary Alice Young.\r\nWhen you read this morning's paper, you may come across an article about the unusual day I had last week.\r\nNormally, there's never anything newsworthy about my life.\r\nBut that all changed last Thursday.\r\nOf course, everything seemed quite normal at first.\r\nI made breakfast for my family.\r\nI performed my chores.\r\nI completed my projects.\r\nI ran my errands.\r\nIn truth, I spent the day as I spent every other day, quietly polishing the routine of my life until it gleamed with perfection.\r\nThat's why it was so astonishing when I decided to go to my hallway closet and retrieve a revolver that had never been used.\r\nMy body was discovered by my neighbor, Mrs. Martha Huber, who'd been startled by a strange popping sound.\r\nHer curiosity aroused. Mrs. Huber tried to think of a reason for dropping in on me unannounced.\r\nAfter some initial hesitation, she decided to return the blender she had borrowed from me six months before.\r\nIt's my neighbour, I think she's been shot! There's blood everywhere! Yes! You've got to send an ambulance! You've got to send one right now!\r\nAnd for a moment, Mrs. Huber stood motionless in her kitchen, grief-stricken by this senseless tragedy.\r\nBut only for a moment. If there was one thing Mrs. Huber was known for, it was her ability to look on the bright side.	\N
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Progress" (id, "userId", "lessonId", "isCompleted", "lastReviewedDate", "reviewCount") FROM stdin;
1	9SMq1o0GRC60SicOda14k9X2gRorgWpS	0c6b035e-eb65-40dd-8448-ab05ee0654ea	t	2025-11-27 02:06:47.757	2
3	9SMq1o0GRC60SicOda14k9X2gRorgWpS	77e95ac0-e041-4223-a143-7517351ff094	t	2025-11-27 02:09:36.077	2
4	9SMq1o0GRC60SicOda14k9X2gRorgWpS	e44f70e0-0a10-4096-a1f8-83a4483c0928	t	2025-11-27 02:10:45.316	1
5	9SMq1o0GRC60SicOda14k9X2gRorgWpS	f30d28e4-42a8-4926-af7e-7350f2d6448a	t	2025-11-27 02:47:39.554	1
6	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	0c6b035e-eb65-40dd-8448-ab05ee0654ea	t	2025-11-27 03:11:32.223	1
7	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	319294bb-ebbe-4f57-a585-03b4c96fb681	t	2025-11-27 03:11:57.661	1
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Session" (id, "userId", "expiresAt", token, "ipAddress", "userAgent", "createdAt", "updatedAt") FROM stdin;
cKuABNhjeldwky3QPwCYNpRQGNOK6BBv	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	2025-12-04 03:15:00.254	GQyv3WhWbVJ1j1LmrRJlSVH6szXTPlRV	206.237.119.213	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-27 03:15:00.255	2025-11-27 03:15:00.255
\.


--
-- Data for Name: StudyActivity; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."StudyActivity" (id, "userId", "lessonId", "activityType", "createdAt") FROM stdin;
afb17888-7cf1-4d4c-af15-ea5201e0e755	9SMq1o0GRC60SicOda14k9X2gRorgWpS	0c6b035e-eb65-40dd-8448-ab05ee0654ea	COMPLETE	2025-11-25 01:09:41.248
cf1634af-d9e2-49ec-8e3c-3aeff0c31556	9SMq1o0GRC60SicOda14k9X2gRorgWpS	0c6b035e-eb65-40dd-8448-ab05ee0654ea	REVIEW	2025-11-27 02:06:47.757
004b0d9a-ad42-4aee-a4ae-ee9bfaf4e4ea	9SMq1o0GRC60SicOda14k9X2gRorgWpS	77e95ac0-e041-4223-a143-7517351ff094	COMPLETE	2025-11-24 02:07:06.956
4cc85a13-ae8d-4836-ab77-350f94120957	9SMq1o0GRC60SicOda14k9X2gRorgWpS	77e95ac0-e041-4223-a143-7517351ff094	REVIEW	2025-11-27 02:09:36.077
dc807ccc-c114-4818-8376-012eae585bb4	9SMq1o0GRC60SicOda14k9X2gRorgWpS	e44f70e0-0a10-4096-a1f8-83a4483c0928	COMPLETE	2025-11-27 02:10:45.316
f05b2d0c-9ce5-491b-95c4-e82d0f08ccfc	9SMq1o0GRC60SicOda14k9X2gRorgWpS	f30d28e4-42a8-4926-af7e-7350f2d6448a	COMPLETE	2025-11-27 02:47:39.554
17357764-dc35-4fc1-8772-9c8a0c71f88e	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	0c6b035e-eb65-40dd-8448-ab05ee0654ea	COMPLETE	2025-11-27 03:11:32.223
24dabc12-fe4a-448c-8d83-613475ec9d49	0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	319294bb-ebbe-4f57-a585-03b4c96fb681	COMPLETE	2025-11-27 03:11:57.661
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."User" (id, email, "emailVerified", name, image, password, "createdAt", "updatedAt") FROM stdin;
9SMq1o0GRC60SicOda14k9X2gRorgWpS	shanewestlife@outlook.com	t	Shane	\N	\N	2025-11-27 01:04:35.433	2025-11-27 01:06:01.404
0dPZXfNhZIOLaFJ3xrDW3iyWGZM07Yef	codersjj@gmail.com	t	codersjj	\N	\N	2025-11-27 02:48:39.926	2025-11-27 03:11:02.6
\.


--
-- Data for Name: Verification; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
VSC36BtJ25OB1WtGD1lnlvpQXbPZja0D	email-verification-otp-codersjj@gmail.com	547244:1	2025-11-27 03:20:06.118	2025-11-27 03:10:06.118	2025-11-27 03:10:24.486
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
581e626c-ee3e-46f1-8302-a0e1e74657a9	c8fa2fffb626272b7c7b27cbe191df4f30f2aa3498c06e46a63e83aaa3e92c7a	2025-11-27 00:38:41.524129+00	20251127003838_init	\N	\N	2025-11-27 00:38:39.800809+00	1
\.


--
-- Name: Progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Progress_id_seq"', 7, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: StudyActivity StudyActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."StudyActivity"
    ADD CONSTRAINT "StudyActivity_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Verification Verification_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_providerId_accountId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON public."Account" USING btree ("providerId", "accountId");


--
-- Name: Progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON public."Progress" USING btree ("userId", "lessonId");


--
-- Name: Session_token_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);


--
-- Name: StudyActivity_userId_createdAt_idx; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE INDEX "StudyActivity_userId_createdAt_idx" ON public."StudyActivity" USING btree ("userId", "createdAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Verification_identifier_value_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Verification_identifier_value_key" ON public."Verification" USING btree (identifier, value);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyActivity StudyActivity_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."StudyActivity"
    ADD CONSTRAINT "StudyActivity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyActivity StudyActivity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."StudyActivity"
    ADD CONSTRAINT "StudyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: prisma_migration
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 4U7TWKh7ZsDFCkq12myiNr9exj5ahKnwYSODsY6uq9rt8LJ8nHfFh8exIzbQVbM

