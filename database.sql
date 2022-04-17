

CREATE TABLE users (
	id bigserial ,
	username varchar(255) NOT NULL,
	email varchar(255) UNIQUE,
	password varchar(255) NOT NULL,
	role varchar(25) NOT NULL
);

INSERT INTO users (username, email, password, role) VALUES (
	'fahad aleem', 'fahad.aleem@ivl.com','123456', 'Admin'
);

CREATE TABLE main_section (
	section_id bigserial primary key,
	section_title varchar(255) not null,
	is_expanded boolean not null
);

INSERT INTO main_section (section_title, is_expanded) VALUES (
'PN Core Values', true
);

INSERT INTO main_section (section_title, is_expanded) VALUES (
'Professional Attributes', false
);


CREATE TABLE sub_sections (
	section_id bigserial primary key,
	section_title varchar(255) not null,
	section_description text not null, 
	fk_main_section int references main_section(section_id)
	);

INSERT INTO sub_sections (section_title, section_description, fk_main_section) 	VALUES (
	'Characteristic', 'this is a new section', 1
);

CREATE TABLE sub_sub_sections (
		section_id bigserial primary key,
	section_title varchar(255) not null,
	fk_sub_section int references sub_sections(section_id)
);

CREATE TABLE questions (
	question_id bigserial primary key,
	question_title varchar(255) not null,
	question_description varchar(255) not null,
	options json not null,
	fk_sub_sections int references sub_sections(section_id),
	fk_sub_sub_sections int references sub_sub_sections(section_id));
	


CREATE TABLE students (
	pNO serial primary key, 
	userName varchar(255) not null, 
	fatherName varchar(255) not null, 
	courseName varchar(255) not null
);

insert into students (userName, fatherName, courseName) values ('fahad aleem','muhammad aleem', 'ICS');