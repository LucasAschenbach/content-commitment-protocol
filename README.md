# **Welcome to zertify!**

AI developement is reaching it's tipping point with newest projects like Sora or Dall-E which will even further accelerate the already exponential growth of the problem we are adressing. Deepfakes. 

Our main goal is to deliver a seemless but secure solution for data signatures to Ethereum. We strongly focused on building a proof of concept that shows the feasibility of our architecture. For this, we chose to leverage zk-technology and proof folding to ensure safety and scalability for the application. 

## **The Architecture**

At it's core, zertify uses a commitment(C) that connects the signature to the signed piece of data. Two main features make our solution unique.

>1. **Updatability**: The commitment should be infinitely updatable without invalidating any authorizations. Each update should only requiring the information available from the previous step. The update operations(functions) must be public.
![IMG_0220](https://github.com/LucasAschenbach/content-commitment-protocol/assets/158106595/4e30d8ac-3c9d-4c78-a752-634a751e6080)   

>2. **Post-Compromise Security**: If a key-pair is compromized, the original owner should be able to learn about the compromise as soon as the key-pair is used and prevent any further uses.
![IMG_0216](https://github.com/LucasAschenbach/content-commitment-protocol/assets/158106595/7c0ee3c7-2abf-49c9-8857-ab4e3ca1fda3)


## **Our Proof of Concept**


