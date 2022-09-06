CREATE SCHEMA encurtador AUTHORIZATION ucoxayqr;

CREATE TABLE encurtador.tb_url_encurtada(
  cd_uiid character varying(10) NOT NULL,
  de_url_completa character varying(1500) NOT NULL,
  de_url_encurtada character varying(256) NOT NULL,
  dt_cadastro date NOT NULL DEFAULT now()
);

ALTER TABLE encurtador.tb_url_encurtada ADD CONSTRAINT pk_url_encurtada UNIQUE (cd_uiid);