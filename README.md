# THE PROBLEM

When I wanted to deploy my little personal blog to vercel hubby, I got an error saying that `there is a limit of 12 functions on this plan`. So I needed to decrease the number of endpoints.

# THE SOLUTION

The idea is to create 4 general endpoints, one for each main http methods: get, post, put and delete.

Then inside each of these handlers, `request.path` will be checked and the request will be passed to its actual corresponding handler.

# HOW IT WORKS

`vercelit` module :

1- gets all the routes in the given path, say `./routes`

2- loads them using `require`

3- gets all the handlers defined in each route (their path, pattern and handler)

4- creats 4 main handlers for each http method which will server all the requests of that type.

For example, the final general `app.get()` would be something like this:

    app.get(["/", "/posts", "/posts/:id", "/auth/login"], (req, res) => {
        const handler = // find the corresponding handler to serve the req.path
        return handler(req, res)
    })
