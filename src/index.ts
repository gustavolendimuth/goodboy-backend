import app from './app';

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}...`)
})

export default server;