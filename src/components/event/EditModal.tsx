"use client";

import React from 'react';
import {Button, Input, ListBox, Label, Select, FieldError,  Modal, Surface, TextField} from "@heroui/react";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';

import { FaRegEdit } from "react-icons/fa";

const EditModal = ({profile}) => {
const {_id, name, image } = profile


const onSubmit = async(e) =>{
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedProduct = Object.fromEntries(formData.entries())
    console.log("allproduct", updatedProduct);

  toast.success('Product updated ', {
                  duration: 4000,
                  position: 'top-center',
      }); 
      


 const res =  await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/buyer/profile/${_id}`,{

   method : 'PATCH',
   headers : {
  'content-type' : 'application/json'
   
     }, 
    body: JSON.stringify(updatedProduct)
    })
const data = await res.json()
console.log( 'data after post',data);
   window.location.reload();
  

}
    return (
        <div>
    <Modal>
      <Button variant="secondary"> <FaRegEdit /> </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
           
              </Modal.Icon>
              <Modal.Heading>Update Product</Modal.Heading>
              
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                 <form onSubmit={onSubmit}
                           className="p-2 space-y-8 m-2" 
                         >
                       
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Destination Name */}
                             <div className="md:col-span-2">
                               <TextField defaultValue = {title}  name="title" isRequired>
                                 <Label>Product Name</Label>
                                 <Input   placeholder="Enter your product name" className="rounded-2xl" />
                                 <FieldError />
                               </TextField>
                             </div>
               
                             {/* Country */}
                             <TextField defaultValue = {stock}   name="stock" type="number" isRequired>
                               <Label>Total Stock</Label>
                               <Input 
                               type="number"
                               placeholder="100" 
                               className="rounded-2xl" />
                               <FieldError />
                             </TextField>
               
                             {/* Category - Updated Select Component */}
                              <div> 
                               <Select
                               defaultValue = {category} 
                                 name="category"
                                 isRequired
                                 className="rounded-2xl"
                                 placeholder="Select category"
                               >
                                 {/* <Label>Category</Label> */}
                                 <Select.Trigger className="rounded-2xl">
                                   <Select.Value />
                                   <Select.Indicator />
                                 </Select.Trigger>
                                 <Select.Popover>
                                   <ListBox>
                                     <ListBox.Item id="Laptops" textValue="Laptops">
                                   Laptops
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                    
                                     <ListBox.Item id="mobile phones" textValue="mobile phones">
                                     Mobile Phones
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                   
                                     <ListBox.Item id="vehicles" textValue="vehicles">
                                     Vehicles
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     <ListBox.Item id="home appliance" textValue="home appliance">
                                       Home Appliances
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     <ListBox.Item id="furniture" textValue="furniture">
                                  Furniture
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     <ListBox.Item id="sports" textValue="sports">
                                  Sports

                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     
                                   </ListBox>
                                 </Select.Popover>
                               </Select>
                             </div>
               
                             {/* Price */}
                             <TextField  defaultValue = {price}  name="price" type="number" isRequired>
                               <Label>Price(USD)</Label>
                               <Input
                                 type="number"
                                 placeholder="1000"
                                 className="rounded-2xl"
                               />
                               <FieldError />
                             </TextField>
               
                             {/* Departure Date */}
                             {/* <div className="md:col-span-2">
                               <TextField  defaultValue = {sessionStartDate}  name="sessionStartDate" type="date" isRequired>
                                 <Label>Session Start Date</Label>
                                 <Input type="date" className="rounded-2xl" />
                                 <FieldError />
                               </TextField>
                             </div> */}
               
                             {/* Image URL - Removed preview */}
                             <div className="md:col-span-2">
                               <TextField  defaultValue = {image}   name="image" isRequired>
                                 <Label>Image URL</Label>
                                 <Input
                                   type="url"
                                   placeholder="Enter your photo url"
                                   className="rounded-2xl"
                                 />
                                 <FieldError />
                               </TextField>
                             </div>
               
                           
                        <div>
                             <Select
                             defaultValue = {condition} 
                                 name="condition"
                                 isRequired
                                 className="rounded-2xl"
                                 placeholder="Condition"
                               >
                                 {/* <Label>Teaching Mode</Label> */}
                                 <Select.Trigger className="rounded-2xl">
                                   <Select.Value />
                                   <Select.Indicator />
                                 </Select.Trigger>
                                 <Select.Popover>
                                   <ListBox>
                                 <ListBox.Item id="used" textValue="used">
                                       Used
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     <ListBox.Item id="just like" textValue="just like">
                                       Just Like
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                     <ListBox.Item id="referbished" textValue="referbished">
                                       Referbished
                                       <ListBox.ItemIndicator />
                                     </ListBox.Item>
                                   </ListBox>
                                 </Select.Popover>
                               </Select>
                        </div>             
                         </div> 
               
                           {/* Buttons */}
               
                           <Button
                             type="submit"
                             variant="outline"
                            
                             className=" rounded-2xl w-full bg-cyan-500 text-white font-bold"
                           >
                       Save
                              </Button> 
                            
                         </form>
              </Surface>
            </Modal.Body>
           
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>  
        </div>
    );
};

export default EditModal;






