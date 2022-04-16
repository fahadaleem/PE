const pgp = require("pg-promise")({
  noWarnings: true,
});

export const db = pgp(`postgres://postgres:1234@localhost:5432/navy`);

const scripts = {
  createUserTable: `CREATE TABLE users (
	id bigserial ,
	username varchar(255) NOT NULL,
	email varchar(255) UNIQUE,
	password varchar(255) NOT NULL,
	role varchar(25) NOT NULL
)`,
  insertUser: `INSERT INTO users (username, email, password, role) VALUES (
	'fahad aleem', 'fahad.aleem@ivl.com','123456', 'Admin'
)`,
  createSectionTable: `CREATE TABLE sub_sections (
	section_id bigserial primary key,
	section_title varchar(255) not null,
	section_description text not null,
	fk_main_section int references main_section(section_id) 
	)`,
  insertSection: `INSERT INTO formSection (sectionid, sectiontitle, sectionDescription, fk_mainsection) VALUES (
1, 'PERFORMANCE OF DUTIES', 'Measures an officer ability to manage and to get thins done', 1
)`,
  createQuestionTable: `CREATE TABLE questions (
	id bigint primary key,
	questiontitle varchar(255) not null,
	questiondescription varchar(255) not null,
	options json null null,
	fk_formSections int references formsection(sectionid))
`,
  createQuestionTable1: `CREATE TABLE questions (
	question_id bigint primary key,
	question_title varchar(255) not null,
	question_description varchar(255) not null,
	options json not null,
	fk_sub_sections int references sub_sections(section_id),
	fk_sub_sub_sections int references sub_sub_sections(section_id));
	
`,
  insertQuestion: `INSERT INTO questions VALUES (1, 'Planning and preparedness', 'Ability to anticipate, determine goals, identify relevant information, set priorities and deadlines and create a shared vision of the unit and coast guard future', '[{"optionTitle":"Got caught"}]', 1)`,
  insertQuestion1: `INSERT INTO questions (question_title, question_description, options, fk_sub_sub_sections ) VALUES 
('My Quesstion', 'This is a question description', '[{"optionTitle":"Got caught"}]', 1)`,
  createStudents: `CREATE TABLE students (
	pNO serial primary key,
	userName varchar(255) not null, 
	fatherName varchar(255) not null, 
	courseName varchar(255) not null
)`,
  insertStudents: `insert into students (userName, fatherName, courseName) values ('fahad aleem','muhammad aleem', 'ICS')`,
  insertMainSections: `INSERT INTO public."mainSections" values ('Professional Attributes');`,
  createMainSections: `CREATE TABLE main_sections (
	sectionId bigSerial primary key,
	sectionTitle varchar(255) not null
)`,
};
