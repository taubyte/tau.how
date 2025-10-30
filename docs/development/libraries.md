# Libraries

<!-- Source: docs-old/01-dev-getting-started/08-libraries.md -->


If you'd like to move serverless functions code outside of the code repository, you can do so by creating a library. Libraries allow you to share codebase but also create granular access as they have their own repositories.

### Creating a library

Navigate to the `Libraries` tab on the left sidebar. Then click on `+` to create a new library.

![](/images/webconsole-new-library.png)

Name the library then validate.
![](/images/webconsole-new-library-modal.png)

> 💡 **Note**: If you'd like to import an existing library, click on `--Generate--` and select the library you'd like to import.

At the time of writing, only one template is available, so click on `Generate` to create a repository and populate it with the templates code.
![](/images/webconsole-new-library-modal-template-select.png)

Push the configuration changes. Click on the push button on the bottom right. Save the github repository id (in the example `905452907`) and its fullname (in the example `taubyte0/tb_library_tauhow_example_library`), we'll use them later.

![](/images/webconsole-new-library-listed-push-1.png)

Type in a commit message and click on `Finish` to push the changes.

![](/images/webconsole-new-library-listed-push-done.png)

We can trigger a build in dream, but we'll skip it for now as the library ins not in use yet.

### Using the library

#### Edit the library code

First, we need to edit the library code. Click on the `Open` icon to open the repository in a new tab.
![](/images/webconsole-new-library-listed-open-repo.png)

Edit the empty.go file on github.

![](/images/webconsole-new-library-listed-repo-opened.png)

Change the code as follows, then click on `Commit changes...`

![](/images/webconsole-new-library-listed-repo-edited.png)

Here's the code if you'd like to copy/paste it:

```go
package lib

import (
	"github.com/taubyte/go-sdk/event"
)

//export ping
func ping(e event.Event) uint32 {
  h, err := e.HTTP()
  if err != nil {
	return 1
  }

  h.Write([]byte("PONG"))

  return 0
}
```

Click on `Commit changes` to commit and push.

![](/images/webconsole-new-library-listed-repo-commit-modal.png)

#### Use the library in a function

Navigate to the `Functions` tab on the left sidebar. Then click on `+` to create a new function. Name it, set the timout to 1 second, the memory limnit to 10MB, the method to `GET`, the domain to `GeneratedDomain` and the path to `/lib/ping`.

![](/images/webconsole-new-library-new-func-modal.png)

Click on `Select a source`, then select your newly created library. Don't forget to set the entry point to `ping`.

![](/images/webconsole-new-library-new-func-modal-sel-lib.png)

Push the changes. Notice the source is now your library.

![](/images/webconsole-new-library-new-func-modal-push-1.png)

Ignore the changes on the code repository. Click on `Next`.

![](/images/webconsole-new-library-new-func-modal-push-2.png)

> 💡 **Note**: Webconsole create some structure to facilitate an eventual switch to inline code.

Enter a commit message and click on `Finish`.

![](/images/webconsole-new-library-new-func-modal-push-done.png)

Head back to your terminal and trigger a build for the library:

```bash
dream inject push-specific -u blackhole \
-rid 905452907 \
-fn taubyte0/tb_library_tauhow_example_library
```

> 💡 **Note**: use your own repository id and fullname. If you didn't save them you can Navigate to the library, click on it then switch to YAML to find them. Another way if to just open the config repository and find them in `libraries/tauhow_example_library.yaml`.

Next, let's trigger a build for the configuration changes.

```bash
dream inject push-all
```

Wait for the builds to finish. Then click on ⚡️ to open the function's endpoint in a new tab.

![](/images/webconsole-new-library-new-func-exec-btn.png)

You should see the `PONG` message.

![](/images/webconsole-new-library-new-func-exec-window.png)

Congratulations! You've just created and used a library in a function.

### Using the library as a dependency

You can also import the library as a dependency in your inline function code as follows:

#### Library code

Let's add an other function to our library (which will compile to a wasm module). Open the library repository in another tab. The click on `Add file` > `Create new file`.

![](/images/webconsole-new-library-add-file-add-func.png)

Name the file `add.go` and add the following code:

![](/images/webconsole-new-library-add-file-add-func-edit.png)

Here's the code if you'd like to copy/paste it:
 
```go
package lib

//export add
func add(a, b uint32) uint64 {
  return uint64(a) + uint64(b)
}
```

Click on `Commit changes...` to commit and push.

#### Function code

back to Web Console. Navigate to the `Functions` tab on the left sidebar. Then click on `+` to create a new function.
Click on `Template Select`. Select `Go` and `empty`. Close the template modal. 
![](/images/webconsole-new-library-add-func-using-lib-select-template.png)

Name the function `add`, set the timout to 1 second, the memory limnit to 10MB, the method to `GET`, the domain to `GeneratedDomain` , the path to `/lib/add` and the entry point to `doAdd`.

![](/images/webconsole-new-library-add-func-using-lib-edit.png)

Click on `Code` to switch to the code tab. Then paste the following code:

```go
package lib

import (
	"fmt"
	"strconv"

	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
)

// Import `add` the library
//
//go:wasmimport libraries/tauhow_example_library add
func add(a, b uint32) uint64

func getQueryVarAsUint32(h http.Event, varName string) uint32 {
	varStr, err := h.Query().Get(varName)
	if err != nil {
		panic(err)
	}

	varUint, err := strconv.ParseUint(varStr, 10, 32)
	if err != nil {
		panic(err)
	}

	return uint32(varUint)
}

//export doAdd
func doAdd(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

	// call the library function
	sum := add(getQueryVarAsUint32(h, "a"), getQueryVarAsUint32(h, "b"))

	// send the result over http
	h.Write([]byte(fmt.Sprintf("%d", sum)))

	return 0
}
```
> 💡 **Note**: `libraries/<library name>` is resolved within the context of the application the function is part of, then globaly. In this case the function is global so the library is only resolved globaly.

Push the changes.

![](/images/webconsole-new-library-add-func-using-lib-push.png)

Next, let's trigger a build for the configuration changes.

```bash
dream inject push-all
```

![](/images/webconsole-new-library-add-func-using-lib-exec.png)

And you can also use curl to test the function.

```bash
curl 'http://evy8manx0.blackhole.localtau:11605/lib/add?a=40&b=2'
```

Output:
```
42
```

Congratulations! You've just created and used a library as a dependency in a function.