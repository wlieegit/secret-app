# 1 every nextauth page it will get csrf token from response, and also server will set the next-auth.csrf-token and the signature in httpOnly cookie
curl 'http://localhost:3000/api/auth/csrf' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'If-None-Match: "nnhci1ei4t28"' \
  -H 'Referer: http://localhost:3000/signin' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --compressed

response:
< HTTP/1.1 200 OK
< Set-Cookie: next-auth.csrf-token=c040faf3ad08d5a17d766f52e5080063a548e32d48adcb9726b670629ab8f1d1%7C393baffc254ae6fae1cdc0447749488327c0cc04b24f43fa4ce802b519184a74; Path=/; HttpOnly; SameSite=Lax
{"csrfToken":"c040faf3ad08d5a17d766f52e5080063a548e32d48adcb9726b670629ab8f1d1"}

# note: if next-auth.csrf-token cookie is not changed when client makes the same call to GET /api/auth/csrf, server returned 304, e.g. when you logout and refresh page.
# meaning the next-auth.csrf-token cookie is reuseable as long as the csrf-token and the following signature can be verified by the server, approving that the csrf-token is not tempered
# since this cookie is not accessiable via client script, so there is no way the hacker can get it


# 2.1 victum signin call:  __Host-next-auth.csrf-token matches csrfToken in the post form, nextauth issues next-auth.session-token token
curl 'http://localhost:3000/api/auth/callback/polkadot?' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: next-auth.csrf-token=67c7c52db3f0dfb03ae497483cc70ddfea425348d285d5cc0a974a4cded41a9c%7C613b5bc64343705cb6c4245d548409d03af193fdc97c75db8294f42321f13117; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fsignin' \
  -H 'Origin: http://localhost:3000' \
  -H 'Referer: http://localhost:3000/signin' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw 'address=5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9&message=Sign-in+request+for+address+5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9.&signature=0x046bc91dbe57f05d9f5f68eaf492e13116be774e61a52fc55af76d1c8cc49e44c298f59ba339bf7f86656feaeb8c810d5dbeba825c8d48b73fa74090a366138c&redirect=false&csrfToken=_67c7c52db3f0dfb03ae497483cc70ddfea425348d285d5cc0a974a4cded41a9c&callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fsignin&json=true' \
  --compressed -v

response:
< HTTP/2 200 
< Set-Cookie: next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..pzqxNVIfIj2BhMB6.h_JMXP1Pddy7o-3tYx8PuVPC6SUY73eoAICS1p4JRczAwqlkqa5vi5Ktt7P7KIBoNy7-cn5nlzTUwCAgRn3BI7Ur2WjL269T8vqiOhJPS8AvsJUhRieybeHl1vmtkKkvJz8dBoHvX_rZaY0h-DSMbi0xSMBP2gi6YLtMH_pofJLO2I-Mw6q9Ag8.Cn-NyDtVVOaHN6sK-0Fyww; Path=/; Expires=Wed, 25 Jan 2023 22:47:04 GMT; HttpOnly; SameSite=Lax

# 2.2 hacker signin call:   __Host-next-auth.csrf-token doesn't match csrfToken in the post form, nextauth won't issue next-auth.session-token token
curl 'http://localhost:3000/api/auth/callback/polkadot?' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: next-auth.csrf-token=67c7c52db3f0dfb03ae497483cc70ddfea425348d285d5cc0a974a4cded41a9c%7C613b5bc64343705cb6c4245d548409d03af193fdc97c75db8294f42321f13117; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fsignin' \
  -H 'Origin: http://localhost:3000' \
  -H 'Referer: http://localhost:3000/signin' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw 'address=5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9&message=Sign-in+request+for+address+5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9.&signature=0x046bc91dbe57f05d9f5f68eaf492e13116be774e61a52fc55af76d1c8cc49e44c298f59ba339bf7f86656feaeb8c810d5dbeba825c8d48b73fa74090a366138c&redirect=false&csrfToken=_67c7c52db3f0dfb03ae497483cc70ddfea425348d285d5cc0a974a4cded41a9c&callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fsignin&json=true' \
  --compressed -v

response:
< HTTP/2 200 
> Cookie: next-auth.csrf-token=67c7c52db3f0dfb03ae497483cc70ddfea425348d285d5cc0a974a4cded41a9c%7C613b5bc64343705cb6c4245d548409d03af193fdc97c75db8294f42321f13117; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fsignin

# 2.3 hacker signin call, assumed hacker can get the post payload (i.e a signed msg, address, signature) but not the signiature of the csrf-token (as it's in victum's cookie only), and replace the csrf-token with the next-auth.csrf-token got from hacker's browser assessing the target website /api/auth/csrf, and hacker can get a valid session cookie in the end
# meaning if hacker somehow get the payload of the victum's signin request, even without have the next-auth.csrf-token in victum's browser, attacked can get a new one
# via /api/auth/csrf and use it in the tempered signin call (as cookie and the form csrfToken field)
curl 'http://localhost:3000/api/auth/callback/polkadot?' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: next-auth.csrf-token=c040faf3ad08d5a17d766f52e5080063a548e32d48adcb9726b670629ab8f1d1%7C393baffc254ae6fae1cdc0447749488327c0cc04b24f43fa4ce802b519184a74; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fsignin' \
  -H 'Origin: http://localhost:3000' \
  -H 'Referer: http://localhost:3000/signin' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw 'address=5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9&message=Sign-in+request+for+address+5GNSAEpAPGU6XgvD6g4qpboJETMvpmM9nz5eCnUSRHHJHZm9.&signature=0x046bc91dbe57f05d9f5f68eaf492e13116be774e61a52fc55af76d1c8cc49e44c298f59ba339bf7f86656feaeb8c810d5dbeba825c8d48b73fa74090a366138c&redirect=false&csrfToken=c040faf3ad08d5a17d766f52e5080063a548e32d48adcb9726b670629ab8f1d1&callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fsignin&json=true' \
  --compressed -v

response:
< HTTP/1.1 200 OK
< Set-Cookie: next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..F-hW4cAjEdWIPyd1.5zwWKA4d-E9kJSnCevj89tf8UOv47t5TlYk9ZPEYdANMczerNBTp3eyQ92WxgthEh23Wl8huiVLnoJB6ZorfQmkNy__qc1GcpxvjEcCMQwyXnuMQ56XPgeV9zUSX3-2dfTsPLnlWnfobU8xUhgu7tZ7NFzF-TfBOfJ7V7Qu2cft_DAzMoNcjqLo.bil5tMIuOZH8ur0o-8kZtg; Path=/; Expires=Wed, 25 Jan 2023 23:14:25 GMT; HttpOnly; SameSite=Lax

# this kind of vunability is essentially user's login secret is being given to hacker for whatever reason, and that login secret can be used multiple times, so hacker can reuse it.
# Fix 1 would be add another layer of authentication, such as recapture, or multifactor
# Fix 2 would be (1) frontend ask for server side random nounce which will be saved in server side, and this nounce has short expire time too and can only be used by once; (2) frontend login with adding the extra nounce into the signed msg, and then backend will check that nounce exists and not used before, if so only then grant session, can then delete the nounce (no use anymore)
# for fix 2, even hacker has the login secret (which included the nouce and signature), it can't be replayed as server side state has ensured use only once. Hacker can ask for nounce but he can't sign the login with new nounce as he doens't have signning key.


# 2.4 suppose hacker can make victum to click an email with below content, while the victum has open session with the app:
```html
<html>
    <body>
        <a href="https://secret-app-wpfi.vercel.app/api/v1/secret?csrfToken=">get a gift</a>
    </body>
</html>
```
# in our case it's a get call, there will be no state change triggered by this call but if it's other calls that does make change to user data, then hacker already made some benefit.
# To prevent this, the backend can enforce the api parameter/header asking a csrfToken explicitly and validate it with the one from cookie, as that token can't match the one inside that victums' cookie, even hacker can get a new csrfToken, it won't match the one saved in victum's cookie,
# thus this double cookie submit approach can mitigate such vunability, i.e. Cross Site Request Forgery

