addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

    let req_query = new URL(request.url).searchParams.get('q')


    if (req_query == null) {

        const reply = {
            "status": "failed",
            "message": "Send with an url query"
        };

        return new Response(JSON.stringify(reply), {
            headers: {
                "content-type": "application/json",
            },
        })

    } else {
        var id = req_query.split("/").pop()
    }

    var result = await fetch(`https://gwapi.zee5.com/content/details/${id}?translation=en&country=IN&version=2`, {
        headers: {
            "x-access-token": await token(),
            'Content-Type': 'application/json'
        }
    })
    var result = await result.json()

    const error_msg = {
        "status": "failed",
        "message": "Invalid URL"
    }

    if (result.title == undefined || result.image_url == undefined) {
        return new Response(JSON.stringify(error_msg), {
            status: 400,
            headers: ({
                "Content-Type": "application/json",
            })
        })
    } else {
        var pass = ({
            title: result.title,
            image: result.image_url,
            description: result.description,
            hls: `https://zee5vodnd.akamaized.net${result.hls[0].replace("drm", "hls")}${await token()}`
        })
        res_data = {
            "title": pass.title,
            "description": pass.description,
            "thumbnail": pass.image,
            "Video_URL": pass.hls
        }
        return new Response(await JSON.stringify(res_data), {
            status: 200,
            headers: ({
                "Content-Type": "application/json",
            })
        })
    }
}

async function token() {
    var token = await fetch('https://useraction.zee5.com/tokennd/')
    var token = await token.json()
    return token.video_token
}