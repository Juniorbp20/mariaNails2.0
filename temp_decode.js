const token = process.argv[1];
const parts = token.split('.');
const decode = (s) => JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));
console.log('header', decode(parts[0]));
console.log('payload', decode(parts[1]));
