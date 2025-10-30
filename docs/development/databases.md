# Databases

<!-- Source: docs-old/01-dev-getting-started/06-create-and-use-database.md -->

You've already set up your first project, created a serverless function, and launched a website. Now, let's take it up a notch by integrating a database into your application.

### Creating the Database

First, navigate to Database in the side menu and click the + button.
![](/images/webconsole-dreamland-create-new-database.png)

Name the database `example_kv_store`. As a matcher, use `/example/kv`. Set replication to `min=1, max=2`. Set the size to `100MB` and validate.
![](/images/webconsole-dreamland-create-new-database-modal.png)
>💡 **Note**: Just like storage, the matcher can be any string and even a regular expression. There's no restrictions on the matcher but I prefer to use a path like `/example/kv`.

Now, you should see your new database in the list.
![](/images/webconsole-dreamland-create-new-database-done.png)

Changes are currently only saved locally in your browser's virtual filesystem. Click on the green button on the bottom right corner. Review the changes, add a commit message, and click on Push.
![](/images/webconsole-dreamland-create-new-database-push-2.png)

### Use the Database

Taubyte databasees are instantiated on the fly when you first use it. This is why you can use regular expressions as a matcher. For example, if we used /profile/history/[^/]+, opening /profile/history/userA would create a database just for that user.

Let's create two functions that will use the database: one to store a key/value and another to get the value given a key. For detailed steps on how to create a function, see [Create a function](../03-first-function).

#### Setting a Key
Start with the upload function. Go to `Functions` and click on the `+` button. Create a new function named `kv_set`. Ensure it has enough memory; 10MB should be more than enough. Set the method to `POST`, use the generated domain, set the path to `/api/kv`, and set the entry point to `set`.
![](/images/webconsole-dreamland-create-new-database-set-func-modal.png)

Switch to the code view and add the following code:
```go
package lib

import (
	"encoding/json"

	"github.com/taubyte/go-sdk/database"
	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
)

func fail(h http.Event, err error, code int) uint32 {
	h.Write([]byte(err.Error()))
	h.Return(code)
	return 1
}

type Req struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

//export set
func set(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

	// (Create) & Open the database
	db, err := database.New("/example/kv")
	if err != nil {
		return fail(h, err, 500)
	}

	// Decode the request body
	reqDec := json.NewDecoder(h.Body())
	defer h.Body().Close()

	// Decode the request body
	var req Req
	err = reqDec.Decode(&req)
	if err != nil {
		return fail(h, err, 500)
	}

	// Put the key/value into the database
	err = db.Put(req.Key, []byte(req.Value))
	if err != nil {
		return fail(h, err, 500)
	}

	return 0
}
```

Validate the new function, push the changes then go back to your terminal in order to trigger build:
```bash
dream inject push-all
```

Once the build is done, you can test the function by sending a POST request to the endpoint:
```bash
curl -X POST http://evy8manx0.blackhole.localtau:11005/api/kv -H "Content-Type: application/json" -d '{
  "key": "message",
  "value": "hello world!"
}'
```
> 💡 **Note**: Replace `evy8manx0.blackhole.localtau` with your own domain and 11005 with your own port.


Unless the curl fails, we now have a key `message` that contains `hello world!` in our database.

#### Getting a Key

Let's create a function to get the value given a key. To save time, you can use the clone icon to clone the `kv_set` function.

![](/images/webconsole-dreamland-create-new-database-get-func-clone.png)	

Edit the freshly cloned function, name it `kv_get`, set the method to `GET`, and set the entry point to `get`.

![](/images/webconsole-dreamland-create-new-database-get-func-edit.png)

Switch to the code view and add the following code:
```go
package lib

import (
	"github.com/taubyte/go-sdk/database"
	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
)

func fail(h http.Event, err error, code int) uint32 {
	h.Write([]byte(err.Error()))
	h.Return(code)
	return 1
}

//export get
func get(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

	key, err := h.Query().Get("key")
	if err != nil {
		return fail(h, err, 400)
	}

	db, err := database.New("/example/kv")
	if err != nil {
		return fail(h, err, 500)
	}

	value, err := db.Get(key)
	if err != nil {
		return fail(h, err, 500)
	}

	h.Write(value)
	h.Return(200)

	return 0
}

```

Same as for the previous function: validate, push then trigger build:
```bash
dream inject push-all
```

Wait for the build to finish, then test the function by sending a GET request to the endpoint:
```bash
curl http://evy8manx0.blackhole.localtau:11005/api/kv?key=message
```

Output:
```
hello world!
```

On chrome, you can also see the performance of the function:
![](/images/webconsole-dreamland-create-new-database-get-func-perf.png)

Congratulations! You've now created and used a database in your application.