# Scripts executados no postgres
```SQL
    CREATE TABLE people(  
        id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        create_time DATE,
        name VARCHAR(255),
        cpf VARCHAR(11),
        rg VARCHAR(10),
        telefone VARCHAR(14),
        numCartao VARCHAR(16),
        dataCartao DATE,
        cvvCartao INT
    );
```

```SQL
    ALTER TABLE people ALTER COLUMN create_time SET DEFAULT now();
```

```SQL
    ALTER TABLE people ADD COLUMN birthday DATE;
```