---
title: Storage
---

At this point, you've created a function and a website. Let's make things interesting by using object storage.

### Creating the Storage

First, navigate to `Storage` in the side menu and click the `+` button.

![](/images/webconsole-dreamland-create-new-storage.png)

Name the storage `simple_storage`. As a matcher, use `/simple/storage`. Ensure the type is set to `Object Bucket` and the size to `1GB`.

![](/images/webconsole-dreamland-create-new-storage-modal.png)
>💡 **Note**: The matcher can be any string and even a regular expression. I prefer to use a path like `/simple/storage` to make it easier to identify the storage.

Validate to create the storage configuration.

![](/images/webconsole-dreamland-create-new-storage-modal-done.png)

Now, you should see your new storage in the list.

![](/images/webconsole-dreamland-create-new-storage-modal-listed.png)

Remember, this configuration only exists in the local copy of the repository stored in the browser's virtual file system. To push the changes to the remote repository, click on the push button at the bottom right corner. Review the changes, add a commit message, and click on `Push`.

![](/images/webconsole-dreamland-create-new-storage-push-modal-2.png)

### Use the Storage

Unlike S3 storage, Taubyte storage is instantiated on the fly when you first use it. This is why you can use regular expressions as a matcher. For example, if we used `/profile/storage/[^/]+`, opening `/profile/storage/userA` would create a bucket just for that user. Most importantly, as of today, it's only accessible from your code. To access it through an HTTP endpoint, you'll need to create a function.

Let's create two functions that will use the storage: one to upload a file and another to download a file. For detailed steps on how to create a function, see [Create a function](../03-first-function).

#### Upload a File

Start with the upload function. Go to `Functions` and click on the `+` button. Create a new function named `store_file`. Ensure it has enough memory for your files; here, we're going for 100MB. Set the method to `POST`, use the generated domain, set the path to `/api/store`, and set the entry point to `store`.

![](/images/webconsole-dreamland-create-new-storage-upload-func.png)

Switch to the code view and add the following code:

```go
package lib

import (
	"encoding/json"
	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
	"github.com/taubyte/go-sdk/storage"
)

func failed(h http.Event, err error, code int) uint32 {
	h.Write([]byte(err.Error()))
	h.Return(code)
	return 1
}

type Req struct {
	Filename string `json:"filename"`
	Data     string `json:"data"`
}

//export store
func store(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

    // Open/Create the storage
	sto, err := storage.New("/simple/storage")
	if err != nil {
		return failed(h, err, 500)
	}

    // Read the request body
	reqDec := json.NewDecoder(h.Body())
	defer h.Body().Close()

	var req Req
	err = reqDec.Decode(&req)
	if err != nil {
		return failed(h, err, 500)
	}

    // Select file/object
	file := sto.File(req.Filename)

    // Write data to the file
	_, err = file.Add([]byte(req.Data), true)
	if err != nil {
		return failed(h, err, 500)
	}

	return 0
}
```

Since we're using `dream`, we need to trigger builds:

```bash
dream inject push-all
```

Once the build is done, you can test the function by sending a POST request to the endpoint:

```bash
curl -I -X POST http://evy8manx0.blackhole.localtau:11005/api/store \
-H "Content-Type: application/json" \
-d '{
  "filename": "example.txt",
  "data": "This is the content of the file."
}'
```

Unless the curl fails, we now have an object `example.txt` that contains `This is the content of the file.` in our storage.

#### Download a File

Now, let's create a function to download the file we just uploaded. To save time, you can use the clone icon to clone the `store_file` function.

![](/images/webconsole-dreamland-create-new-storage-download-func-clone.png)

Edit the freshly cloned function, name it `get_file`, set the method to `GET`, and set the entry point to `get`.

![](/images/webconsole-dreamland-create-new-storage-download-func-edit.png)

Switch to the code view and add the following code:

```go
package lib

import (
	"io"

	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
	"github.com/taubyte/go-sdk/storage"
)

func failed(h http.Event, err error, code int) uint32 {
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

    // Read the filename from the query string
	filename, err := h.Query().Get("filename")
	if err != nil {
		return failed(h, err, 400)
	}

    // Open/Create the storage
	sto, err := storage.New("/simple/storage")
	if err != nil {
		return failed(h, err, 500)
	}

    // Select file/object
	file := sto.File(filename)

    // Get a io.ReadCloser
	reader, err := file.GetFile()
	if err != nil {
		return failed(h, err, 500)
	}
	defer reader.Close()

    // Read from file and write to response
	_, err = io.Copy(h, reader)
	if err != nil {
		return failed(h, err, 500)
	}

	return 0
}
```

Trigger the build:

```bash
dream inject push-all
```

Now, you can test the function by sending a GET request to the endpoint:

```bash
curl http://evy8manx0.blackhole.localtau:11005/api/get?filename=example.txt
```

The output should be:

```
This is the content of the file.
```

Congratulations! You've just created a storage and used it.




