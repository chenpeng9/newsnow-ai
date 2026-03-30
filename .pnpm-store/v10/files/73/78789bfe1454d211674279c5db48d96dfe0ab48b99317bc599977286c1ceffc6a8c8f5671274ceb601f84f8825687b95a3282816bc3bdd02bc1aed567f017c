# Favicons-scraper
A fully-typed wrapper for the favicons scraper API<br>
The API returns a list of the favicons from any domain you give it.

### Node.js
If you want to implement a favicon scraper in your node (or bun) project, check out this scraper built in node. Its a full scraper instead of just a wrapper for an API. [Node Scraper](https://www.npmjs.com/package/favicon-scraper-node)

### Demo
[www.FaviconScraper](https://www.faviconscraper.mc.hzuccon.com/#/)

### Usage
```ts
import { getLogos } from 'favicons-scraper'

const url = 'https://facebook.com/user'
const urlLogos = await getLogos(url)

const domain = 'facebook.com'
const domainLogos = await getLogos(domain)
console.log(urlLogos)
console.log(domainLogos)
/*
[
  {
    size: { width: 120, height: 120 },
    type: 'png',
    mime: 'image/png',
    src: 'https://z-m-static.xx.fbcdn.net/rsrc.php/v3/yO/r/_GHbZfYGSj-.png'
    device: 'desktop'
  }
]
*/
```

You can get the favicons from a specific device using the options.
```ts
const options = {
  devices: 'mobile' // devices accepts a string containing all of the devices you want, eg: 'mobile desktop' for mobile and desktop favicons (default) 
}

const domainLogos = await getLogos('web.dev', options)
/*
[
  {
    size: { width: 180, height: 180 },
    type: 'png',
    mime: 'image/png',
    src: 'https://www.gstatic.com/devrel-devsite/prod/ve5ef9ac7b497e19ece9427facc78d0c59aaab7a2bc6a0f75fdae93f4ee589f67/web/images/touchicon-180.png',
    device: 'mobile'
  }...
]
*/
```