--
-- PostgreSQL database dump
--

\restrict IgoQyRaMgNFSouTazoXtKFZFdLSQRmWBqxepTAbnoh6EnRc8xA9h315LGe1labP

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_supply_requests_status; Type: TYPE; Schema: public; Owner: riwimedicare_user
--

CREATE TYPE public.enum_supply_requests_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed'
);


ALTER TYPE public.enum_supply_requests_status OWNER TO riwimedicare_user;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: riwimedicare_user
--

CREATE TYPE public.enum_users_role AS ENUM (
    'administrator',
    'requestManager'
);


ALTER TYPE public.enum_users_role OWNER TO riwimedicare_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO riwimedicare_user;

--
-- Name: clinics; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public.clinics (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "taxId" character varying(255) NOT NULL,
    "managerName" character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.clinics OWNER TO riwimedicare_user;

--
-- Name: clinics_id_seq; Type: SEQUENCE; Schema: public; Owner: riwimedicare_user
--

CREATE SEQUENCE public.clinics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clinics_id_seq OWNER TO riwimedicare_user;

--
-- Name: clinics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riwimedicare_user
--

ALTER SEQUENCE public.clinics_id_seq OWNED BY public.clinics.id;


--
-- Name: medications; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public.medications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "warehouseId" integer NOT NULL,
    "availableQuantity" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.medications OWNER TO riwimedicare_user;

--
-- Name: medications_id_seq; Type: SEQUENCE; Schema: public; Owner: riwimedicare_user
--

CREATE SEQUENCE public.medications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medications_id_seq OWNER TO riwimedicare_user;

--
-- Name: medications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riwimedicare_user
--

ALTER SEQUENCE public.medications_id_seq OWNED BY public.medications.id;


--
-- Name: supply_requests; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public.supply_requests (
    id integer NOT NULL,
    "clinicId" integer NOT NULL,
    "medicationId" integer NOT NULL,
    "warehouseId" integer NOT NULL,
    "requestManagerId" integer NOT NULL,
    "requestedQuantity" integer NOT NULL,
    status public.enum_supply_requests_status DEFAULT 'pending'::public.enum_supply_requests_status NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.supply_requests OWNER TO riwimedicare_user;

--
-- Name: supply_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: riwimedicare_user
--

CREATE SEQUENCE public.supply_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supply_requests_id_seq OWNER TO riwimedicare_user;

--
-- Name: supply_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riwimedicare_user
--

ALTER SEQUENCE public.supply_requests_id_seq OWNED BY public.supply_requests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO riwimedicare_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: riwimedicare_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO riwimedicare_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riwimedicare_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: riwimedicare_user
--

CREATE TABLE public.warehouses (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO riwimedicare_user;

--
-- Name: warehouses_id_seq; Type: SEQUENCE; Schema: public; Owner: riwimedicare_user
--

CREATE SEQUENCE public.warehouses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouses_id_seq OWNER TO riwimedicare_user;

--
-- Name: warehouses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riwimedicare_user
--

ALTER SEQUENCE public.warehouses_id_seq OWNED BY public.warehouses.id;


--
-- Name: clinics id; Type: DEFAULT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.clinics ALTER COLUMN id SET DEFAULT nextval('public.clinics_id_seq'::regclass);


--
-- Name: medications id; Type: DEFAULT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.medications ALTER COLUMN id SET DEFAULT nextval('public.medications_id_seq'::regclass);


--
-- Name: supply_requests id; Type: DEFAULT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests ALTER COLUMN id SET DEFAULT nextval('public.supply_requests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: warehouses id; Type: DEFAULT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.warehouses ALTER COLUMN id SET DEFAULT nextval('public.warehouses_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260101000001-create-users.js
20260101000002-create-clinics.js
20260101000003-create-warehouses.js
20260101000004-create-medications.js
20260101000005-create-supply-requests.js
\.


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public.clinics (id, name, "taxId", "managerName", "isActive", "createdAt", "updatedAt") FROM stdin;
2	North Clinic	TAX-P2-001	Alice Updated	f	2026-08-31 13:15:53.742+00	2026-08-31 13:16:03.161+00
9	Clinica San Rafael	TAX-900111222	Marta Londono	t	2026-08-31 13:41:29.363+00	2026-08-31 13:41:29.363+00
10	Clinica Los Andes	TAX-900333444	Julian Herrera	t	2026-08-31 13:41:29.363+00	2026-08-31 13:41:29.363+00
11	Clinica del Norte	TAX-900555666	Sofia Vargas	t	2026-08-31 13:41:29.363+00	2026-08-31 13:41:29.363+00
\.


--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public.medications (id, name, description, "warehouseId", "availableQuantity", "isActive", "createdAt", "updatedAt") FROM stdin;
3	Ibuprofen	Painkiller	2	250	f	2026-08-31 13:16:14.463+00	2026-08-31 13:16:23.087+00
4	Ibuprofen 400mg	Anti-inflammatory painkiller, box of 30 tablets	3	500	t	2026-08-31 13:41:29.368+00	2026-08-31 13:41:29.368+00
5	Amoxicillin 500mg	Antibiotic capsules, box of 20	3	300	t	2026-08-31 13:41:29.368+00	2026-08-31 13:41:29.368+00
6	Saline Solution 1L	Intravenous saline solution bag	3	150	t	2026-08-31 13:41:29.368+00	2026-08-31 13:41:29.368+00
7	Acetaminophen 500mg	Fever and pain reliever, box of 24 tablets	4	400	t	2026-08-31 13:41:29.368+00	2026-08-31 13:41:29.368+00
8	Surgical Gloves (Box)	Latex-free surgical gloves, box of 100 units	4	200	t	2026-08-31 13:41:29.368+00	2026-08-31 13:41:29.368+00
\.


--
-- Data for Name: supply_requests; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public.supply_requests (id, "clinicId", "medicationId", "warehouseId", "requestManagerId", "requestedQuantity", status, "isDeleted", "createdAt", "updatedAt") FROM stdin;
2	9	4	3	6	20	completed	f	2026-08-31 13:41:45.723+00	2026-08-31 13:41:56.9+00
3	9	5	3	6	25	pending	t	2026-08-31 13:42:12.849+00	2026-08-31 13:42:12.955+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public.users (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
3	Admin One	admin.phase2@test.com	$2b$10$HSKZyxyC19HYdaVQwGoR.eML76RKaQuE4ewUUuqH1dEWbnfELLZii	administrator	2026-08-31 13:15:45.325+00	2026-08-31 13:15:45.325+00
4	Manager One	rm.phase2@test.com	$2b$10$e41oDb1ITWsom5opS.0z4O4DFTw2uPpO0Xg6JF2N3IwXmcKUt52NS	requestManager	2026-08-31 13:15:45.41+00	2026-08-31 13:15:45.41+00
5	Admin Phase3	admin.phase3@test.com	$2b$10$p54Nm7.UoK0IXg12KHSYtuqn1yNIpbwlhUhV40EqBXTakQOqIzkNW	administrator	2026-08-31 13:39:17.301+00	2026-08-31 13:39:17.301+00
6	RM Phase3	rm.phase3@test.com	$2b$10$xPKQ0Sb.pHLo.nIA4rNmyegvuD/wqwiEoRDN38.51xvgnH4KfOLzy	requestManager	2026-08-31 13:39:17.394+00	2026-08-31 13:39:17.394+00
15	Laura Gomez	laura.admin@riwimedicare.com	$2b$10$R4.bJYkBU6GvSrb0gQ3veO.e8vW7bx7dtndgOyA4LSjUsIfboW13a	administrator	2026-08-31 13:41:29.357+00	2026-08-31 13:41:29.357+00
16	Carlos Ramirez	carlos.admin@riwimedicare.com	$2b$10$bEp5Xk8aRNGjRF2ED750DeO2AjdAOQHpk1nj0HEnKwWJwnGY.bm8K	administrator	2026-08-31 13:41:29.357+00	2026-08-31 13:41:29.357+00
17	Diana Torres	diana.manager@riwimedicare.com	$2b$10$5jkwgVyoP/tLyPdwG3pkbu/bkhEU98qfkhcr0GAr665dUdTIiyjvK	requestManager	2026-08-31 13:41:29.357+00	2026-08-31 13:41:29.357+00
18	Felipe Rojas	felipe.manager@riwimedicare.com	$2b$10$20pqdEBbyGNjdwdj9a99w.csIGYVSl2ug2lCdlkh6QAUIodattb96	requestManager	2026-08-31 13:41:29.357+00	2026-08-31 13:41:29.357+00
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: riwimedicare_user
--

COPY public.warehouses (id, name, location, "isActive", "createdAt", "updatedAt") FROM stdin;
2	Central Warehouse	Bogota	f	2026-08-31 13:16:14.357+00	2026-08-31 13:16:23.124+00
3	Central Warehouse	Medellin	t	2026-08-31 13:41:29.365+00	2026-08-31 13:41:29.365+00
4	North Warehouse	Bogota	t	2026-08-31 13:41:29.365+00	2026-08-31 13:41:29.365+00
\.


--
-- Name: clinics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riwimedicare_user
--

SELECT pg_catalog.setval('public.clinics_id_seq', 11, true);


--
-- Name: medications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riwimedicare_user
--

SELECT pg_catalog.setval('public.medications_id_seq', 8, true);


--
-- Name: supply_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riwimedicare_user
--

SELECT pg_catalog.setval('public.supply_requests_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riwimedicare_user
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riwimedicare_user
--

SELECT pg_catalog.setval('public.warehouses_id_seq', 4, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- Name: clinics clinics_taxId_key; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT "clinics_taxId_key" UNIQUE ("taxId");


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: supply_requests supply_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT supply_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: medications medications_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT "medications_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supply_requests supply_requests_clinicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES public.clinics(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supply_requests supply_requests_medicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES public.medications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supply_requests supply_requests_requestManagerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_requestManagerId_fkey" FOREIGN KEY ("requestManagerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supply_requests supply_requests_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: riwimedicare_user
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict IgoQyRaMgNFSouTazoXtKFZFdLSQRmWBqxepTAbnoh6EnRc8xA9h315LGe1labP

