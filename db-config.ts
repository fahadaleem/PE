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
  createSectionTable: `CREATE TABLE formSection (
	sectionid bigint primary key,
	sectiontitle varchar(255) not null,
	sectiondescription text not null
)`,
  insertSection: `INSERT INTO formSection (sectionid, sectiontitle, sectionDescription) VALUES (
1, 'PERFORMANCE OF DUTIES', 'Measures an officer ability to manage and to get thins done'
)`,
  createQuestionTable: `CREATE TABLE questions (
	id bigint primary key,
	questiontitle varchar(255) not null,
	questiondescription varchar(255) not null,
	options json null null,
	fk_formSections int references formsection(sectionid))
`,
  insertQuestion: `INSERT INTO questions VALUES (1, 'Planning and preparedness', 'Ability to anticipate, determine goals, identify relevant information, set priorities and deadlines and create a shared vision of the unit and coast guard future', '[{"optionTitle":"Got caught"}]', 1)`,
};
