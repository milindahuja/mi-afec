# movingimage Angular FEC

## Install dependencies

Run `yarn` to install the dependencies

## server

Run `yarn start` to run the backend and and front end both. Navigate to `http://localhost:3001/` for backend server. It runs with a package called json-server, and the data comes from the db.json file and to `http://localhost:4200/`for the frontend.

Depending upon the operating systems, the above step ay vary. In case of any issue, `yarn start` and `ng serve` can be run separately into two independent terminals.

## Brief description on logic for Add, Edit and Delete operations

- Add Video - I have added 4 authors in author's name select dropdown out of which 3 are existing 1 is new which does not exists in DB. So, I have inititally applied different approach where I was adding the video to the existing Author (if already exists) or else add new author object to the array and the new video object is pushed the videos array of that newly created author object and then whole array being sent as a request body assuming that it will be replace the old one but seems like the backend is working little differently as the whole author array was being added as a new object in original author's array.

And then I tried to just send the author's object a new video was added to (as the seleted author already exists) but it was again returning the error saying duplicate ID (also mentioned in DOCUMENTATION - "Only a value set in a POST request will be respected, but only if not already taken."). In other case I was sending the added video with author with unique ID if if the author already exists and it did work but the new author object with same name with new video object was created in the db . So I reworked on my logic based on my understanding after going through the documentation as there was just a general description of these API works and decided to use the POST API just for the case where select author does not exist and the API accepted the new author object that I sent as a request body was added in the author's araay and it worked as expected.

So for example:
[{
      "id": 1,
      "name": "David Munch",
      "videos": [
        {
            video
        },
        {
            video
        }
      ]

},
{ //newly added author object as this author did not exist before
      "id": unique ID,
      "name": "Milind Ahuja", //New author
      "videos": [
        {
            newly added video object
        }
      ]

}]

- Edit Video - This APi is being used to handle the other scenario that I talked about in the above section where new video is being added and the author name already exists and in the request body I am sending that author object along the new video object that was being pushed the videos array of the author's object and in the url I am sending the id of that existing author's object.

So for example the following object exists in authors json:
{
      "id": 1,
      "name": "David Munch",
      "videos": [
        {
            old video object
        },
        {
            newly added video object
        }
      ]

}

the API Url would look like: http://localhost:3001/authors/1, where 1 is the ID of the existing author.

- Delete Video - Here, initially I was sending the the author's id in the url along with deleted video object as request body assuming the backend would find the video and remove from the author's array keeping the other videos in that author's video array as it is but it delete the whoe author. I tried using different url' http://localhost:3001/authors/{authorID}/video/{videoID} but it was giving 404 so I made use of update API where I was just changing the author's object by removing the selected video from it's videos array and then check if that author's videos array is empty, If that is the case I am removing that author's object from the author's data using DELETE API.

Let us take one of the author's object:
EXAMPLE 1 (More that 1 video): {
      "id": 1,
      "name": "David Munch",
      "videos": [
        {
            video 1
        },
        {
           video 2
        }
      ]

}

User decided to delete Video 1:

Edit API: PUT http://localhost:3001/authors/1 with upated author object as request body:

{
      "id": 1,
      "name": "David Munch",
      "videos": [
        {
           video 2
        }
      ]

}

EXAMPLE 2 (only 1 video): 
{
      "id": 1,
      "name": "David Munch",
      "videos": [
        {
            video 1
        }
      ]
}

DELETE API: DELETE http://localhost:3001/authors/1 and the whole author object is removed

NOTE: As these are dummy API's, I modified the logic a little bit based on my understanding from the documentation, keeping in mind the data the structure of data must remain the same. In the real cases, the logic can be changed and each API would be used for single purposes as we are aware of how backend exactly is working.

Your suggestions based on the API documentations are welcome as I may have missed few things in the documentation and I would definitely modify the logic accordingly. :D  

