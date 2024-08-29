const http = require('http');
const fs = require('fs');
const url = require('url');


http
  .createServer((req, res) => {

    let parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl)

    // console.log(url.parse(req.url, true))
    // console.log(req.url);
    // console.log(req.method);

    res.end("First responses");
    let products = fs.readFileSync('./products.json', 'utf-8')

    // if (req.url === '/products' && req.method == "GET") {
    if (parsedUrl.pathname === '/products' && parsedUrl.query.id == undefined && req.method == "GET") {
      // fs.readFile('./products.json', 'utf-8', (err, data) => {
      //   if (err == null) {
      //     res.end(data);
      //   } else {
      //     res.end(err);
      //   }

      // });

      //for readfylesync
      res.end(products)
    }
    else if (parsedUrl.pathname === '/products' && parsedUrl.query.id != undefined && req.method == "GET") {
      let productArray = JSON.parse(products)
      let product = productArray.find((product) => {
        return product.id == parsedUrl.query.id
      })
      if (product != undefined) {
        res.end(JSON.stringify(product))

      } else {
        res.end(JSON.stringify({ "message": "No product found" }))
      }
      // res.end("For single product"
    }
    if (req.method == "POST" && parsedUrl.pathname === '/products') {
      let product = ""
      // console.log(req)
      req.on('data', (chunk) => {
        product = product + chunk;
      })
      req.on('data', () => {
        console.log(product);
      })
      req.on('end', () => {
        let productsArray = JSON.parse(products)
        let newProduct = JSON.parse(product)

        productsArray.push(newProduct)

        fs.writeFileSync('./products.json', JSON.stringify(productsArray), (err) => {
          if (err == null) {
            res.end(JSON.stringify({ "message": "Product added successfully" }))

          }
          else {
            res.end(JSON.stringify({ "message": "Product Not Added" }))

          }
        })

      })
      res.end("Post is working.")
    }
  })
  .listen(8000)
