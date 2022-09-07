
# Tweteroo

<p align="center">
   <img width=350 src="https://bootcampra.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F089d96f5-8c2e-451d-be67-56fcedf3670e%2F919fa83bed3698c340186745cb0214b3-removebg-preview.png?table=block&id=88dcf7f3-e5dd-4dc0-a91a-1de8e91a0258&spaceId=f797e032-5eb2-4c9d-beb7-cd7181e19e47&width=250&userId=&cache=v2"/>
</p>


- Este projeto é uma cópia da api do site de mensagens batepapo-uol

- Você digita seu nome e entra em um chat para poder papear

- Você pode enviar mensagens públicas ou privadas

***

## Como usar

Instale meu projeto e configure o .env como no exemplo

```bash
  git clone git@github.com:marcojr73/projeto12-batepapo-uol-api.git
```

```bash
  npm i
  
  npm run dev
```

***

##	 Tecnologias e Conceitos

- Node.js
- Express
- DayJs
- Validação com Joi

***
    
## API Reference

#### Sign-up

```
  POST /participants
```

| sent by |Parameter | Type     |             
| :-------- |:-------- | :------- | 
| `body` |`name` | `string` |

#### Get a list participants

```
  GET /participants
```

#### Post a new message

```
  POST /messages
```

| sent by |Parameter | Type     |             
| :-------- |:-------- | :------- | 
| `body` |`to` | `string` |
| `body` |`text` | `string` |
| `body` |`type` | `string` |

#### get last messages

```
  GET /messages?limit=${numberLastMessages}
```
#### Update status participant

```
  POST /status
```

| sent by |Parameter | Type     |             
| :-------- |:-------- | :------- | 
| `header` |`name` | `string` |



