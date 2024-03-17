# **Welcome to zertify!**


AI developement is reaching it's tipping point with newest projects like Sora or Dall-E which will even further accelerate the already exponential growth of the problem we are adressing. Deepfakes. 

Our main goal is to deliver a seemless but secure solution for data signatures to Ethereum. We strongly focused on building a proof of concept that shows the feasibility of our architecture. For this, we chose to leverage zk-technology and proof folding to ensure safety and scalability. 


## **The Architecture**
![IMG_0216](https://github.com/LucasAschenbach/content-commitment-protocol/assets/158106595/7c0ee3c7-2abf-49c9-8857-ab4e3ca1fda3)
At it's core, zertify uses a commitment(C) that connects the signature to the signed piece of data. 

The commitment is generated from the original piece of data(c<sub>0</sub>). Along with the proof(𝞹) there will always be a record of the operations(phi) that have been performed with the piece of data. introducing one of our advanced safety feature.

>**Post-Compromise Security**: If a key-pair is compromised, the original owner will be informed about any fraudulant on-chain activity and as soon as the key-pair is used further uses can be invalidated by a smart contract that has been issued.
 
## **Proof of Concept: Scalable Proofs**
![IMG_0220](https://github.com/LucasAschenbach/content-commitment-protocol/assets/158106595/4e30d8ac-3c9d-4c78-a752-634a751e6080)  

The main issue with previous solutions is theire lack of adaptibility. Huge amounts of data are beeing processed everyday and there is an increasing trend in fraudulent activities like deepfakeing or manipulation. 

Our solution achieves high scalability by folding the operation records which lets it keep a constant size.

>**Updatability**: The commitment should be infinitely updatable without invalidating any authorizations. Each update should only requiring the information available from the previous step. The update operations(functions) must be public. 
