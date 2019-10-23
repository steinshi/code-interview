# Welcome to Vim!
These are instructions for your coding exercise. Please read them carefully and make sure to ask whatever question pops into your mind!

### Goal
We want to create a system for scheduling appointments with providers (doctors). The end result supports:
- Searching for providers to set up an appointment with.
- Selecting an appointment date from the search results & notifying the provider of the new appointment.
- Receiving updates from the provider of new free dates for appointments

Our system supports both synchronous queries and async queries. We use synchronous queries where possible, but sometimes when we rely on slow/unreliable external systems or when we need an event-based workflow we use an async system.
The synchronous queries use REST APIs - one of which you will build.
The asynchronous queries use a publish-subscribe system based on “channels”. You will connect to this system as both a subscriber and a publisher.

### What are we looking for?
- There is no “right” solution! So long as your code works, is readable and extensible- it’s great!
- You may use whatever external library you need.
- We’re looking for big picture stuff:
  * Is your code architecture clean?
  * Is it easy to add new functionality?
  * Is your code testable?
  * Is your code readable?
  * Does your code handle errors well?
  * Does your code have good logging?
- We’re not looking to find unimportant mistakes:
  * Don’t get stuck if you don’t understand the instructions. We will help you!
  * Don’t get stuck on silly syntax errors in libraries you have no experience with. We will help you!
  * Don’t get stuck on coding environment / bootstrapping issues. We will help you!
- We want you to be able to finish this exercise so we can talk about your solution.
- You are not expected to finish any bonus from part C. They are there if you happen to have enough time and to open up discussion points.
- You are not expected to use any specific framework or even any framework at all - work with what you like.

### Preparing for the exercise
- Make sure you have node.js, npm and git installed
- Clone the repository at `https://github.com/bookmd/code-interview` and create a new branch
- We encourage you to execute each part of this exercise independently. For each part - read the instructions, make sure you understand them with your interviewer, implement the part and call your interviewer before moving on to the next part.

### What’s a Provider?
A provider is a doctor. Its Object model looks like this:
```
{
    “name”: “Roland Deschain” //Provider’s name
    “specialties”: [“Neurologist”, “Cardiologist”] //The provider’s specialties
    “availableDates”: [ //Available time slots for appointments
        {“gte”:”2019-01-31T13:00+02”,”lte”:”2019-01-31T16:00+02”},
        {“gte”:”2019-02-01T08:00+02”,”lte”:”2019-02-01T16:30+02”}
    ]
    “score”: 9.3 //Vim’s “secret sauce” - a provider’s score
}
```
The dates (all dates in our system) are according to ISO-8601 (`YYYY-MM-DDThh:mmZZ`).

### Pubsub system
Our pubsub system is simple. It’s an HTTP server that listens on two endpoints: `publish`, `subscribe`. The system is based on channels, which are just different names for which you can subscribe and publish messages. It is up to the publishers and subscribers to decide which channels to define and how to use and name them.
When a message is sent to a specific channel, the pubsub system sends that message to all of the listeners that subscribed to that specific channel. The pubsub system sends a message to a listener by executing a `POST` request to an endpoint that was given to it by the subscriber.

__To publish a message:__
```
POST /publish
{	“channel”: string,
	“payload”: object,
	“metadata”: object (optional)	}
```
Channel: Required. The channel name you’re publishing a message to.
Payload: Required. The message content. Must be a JSON object.
Metadata: Optional. Any metadata you want to add. Must be a JSON object. This could include, for example, the publisher’s name, or the date of the published message, or a random id. It is it up to the publisher to decide which metadata is relevant.
The server will return `200 (OK)` on successful publish, `400 (BAD REQUEST)` if it received a bad parameter and `5XX` on failed publish.

__To subscribe to a channel:__
```
  POST /subscribe
{	“channel”: string,
	“address”: string	}
```
Channel: Required. The channel name you’re publishing a message to.
Address: Required. The address to which the pubsub system will send messages that are published on the channel. For example, if you’re interested in the channel “providerUpdates”, you might want to create a REST endpoint at `localhost:port/providerUpdates` and send that address to the pubsub system when subscribing.
The server will return `200 (OK)` on successful subscription, `400 (BAD REQUEST)` if it received a bad parameter and `5XX` on failed subscription.

__Receiving messages:__
Once you’re subscribed to a specific channel, when a message is published on this channel your defined endpoint will receive a request with the following body:
```
{	“payload”: object,
	“metadata”: object (optional)	}
```
Both parameters are JSON objects and are completely defined by the message’s publisher. Metadata is optional.

Running the pubsub server: inside `./pubsub/`, run `npm start`. Default port is 3535, but can be changed by running e.g `PORT=12000 npm start`. To delete the listeners you can call `GET /reset`. This will delete all subscriptions.

### Exercise - Part A
The goal of this part is to create a REST endpoint to allow users to set up appointments. Users look for a provider with a specific specialty (e.g ‘Neurologist’, ‘Cardiologist’) and with availability for a certain date. They should receive a list of providers ordered by relevance, and should be able to select one and set up and appointment with them.

Use the mock info under `/providers/providers.json` as your data source, but write your code such that it will be easy to switch this mock for an actual data source like a database / another HTTP endpoint.

1. Create a REST server with the following endpoint:
`GET /appointments?specialty=<SPECIALTY>&date=<DATE>`
  * They should only get providers that specialize in that specific specialty. Specialty is not case sensitive.
  * They should only get providers that have an availability in the specific time requested
  * The providers should be ordered by score
  * The endpoint should return an array of provider names according to the order defined above.
  * If there are no suitable providers the endpoint should return an empty array.
  * If the user gave bad parameters, like a missing specialty or a bad date format, the server should return a `400 (BAD REQUEST)` code.
2. Create an endpoint to set up an appointment.
`POST /appointments`
	`BODY: { “name”: string, “date”: date }`
  * The server should validate that such an availability exists. If it doesn’t, the server should return `400 (BAD REQUEST)`.
  * If such an availability does exist, the server should:
    * Use the pubsub system to publish a new message to a channel called ‘newAppointments’. The message should contain a payload: `{“name”: string, “date”: date}`
    * Return  `200 (OK)` to the client.

Run tests for your code by:
- Making sure the pubsub server is up locally
- Making sure your new REST server is up locally.
- In `./test/`, run `npm run test-a`. The default port of the tested REST API server is 3500

### Exercise - Part B
The goal of this part is to support changes by the providers. Your server should support:
- Adding / removing providers
- Changing providers’ time slots

These changes are given to you asynchronously using the pubsub system.
For this part, assume providers are identified by their name, there’s no duplicates in name. You should make sure your changes don’t create duplicates.
All the changes for the providers’ info should happen in memory, not on disk. Restarting your server should revert them.

1. Subscribe to the channel called ‘addProvider’. The messages on this channel have a payload that’s a provider according to the object model described above. Your server should receive updates on this channel and add/update your data model according to the changes received.
2. Subscribe to the channel called ‘deleteProvider’. The messages on this channel have a payload that looks like this: `{“name”: string}`. Your server should delete the provider according to the deletions received.
3. Subscribe to the channel called ‘updateTimeslots’. The messages on this channel have a payload that looks like this: `{“name”: string, “availableDates”: [...]}`. Your server should update the available time slots according to the payload received. Notice - the dates received contain all available dates, there’s no need to merge the new info with the old one.

Run tests for your code by:
- Making sure the pubsub server is up locally
- Making sure your new REST server is up locally
- In `./test/`, run `npm run test-b`. The default port of the tested REST API server is 3500

### Part C - Bonus (Not ordered by priority, feel free to choose)
- Create a simple web interface that allows searching for providers and setting appointments according to part A.
- We’re interested in analytics - your CTO wrote a service that subscribes to the pubsub system on the channel “analytics”. Design and implement messages on this channel that would support:
  * Understanding when and which service received/published messages on certain channel
  * Performance - How much time each subscriber/publisher worked on each message?
  * Understanding a workflow - If a specific request from the client creates a chain of messages moving from channel to channel, how can we easily tell what the workflow is?
- Create a simple web interface that allows creating/updating/deleting providers’ information according to part B.
- Create a wrapper library for the pubsub system. It should be used as a JS client for people who want to use the pubsub system without executing HTTP requests by themselves. It should find an available port, spin up a server to listen on that port and use that port to listen to published messages.

# Good luck from all of us at Vim!
