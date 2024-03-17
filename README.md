Welcome to zertify!

AI developement is reaching it's tipping point with newest projects like Sora or Dall-E which will even further accelerate the already exponential growth of the problem we are adressing. Deepfakes. 

Our main goal is to develop a seemless but secure solution for data signatures to Ethereum. We strongly focused on building a proof of concept that shows the feasibility of our architecture. For this, we chose to leverage zk-technology and proof folding to ensure safety and scalability for the application. 

The Architecture

At it's core,
![IMG_0215](https://github.com/Mojomarv/content-commitment-protocol/assets/158106595/21c9932b-f9cc-4a07-8e2f-d5814e456cfc)

 zertify uses a commitment(C) that connects the signature to the signed piece of data.  

1. Updatability: The commitment should be infinitely updatable without invalidating any authorizations. Each update should only requiring the information available from the previous step. The update operations must be public.
   


3. Post-Compromise Security: If a key-pair is compromized, the original owner should be able to learn about the compromise as soon as the key-pair is used and prevent any further uses.


Our Proof of Concept
