"use client";

import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { RiDeleteBin3Line } from "react-icons/ri";

type DeleteAddingButtonProps = {
  userId: string;
};

const DeleteAddingButton = ({ userId }: DeleteAddingButtonProps) => {
  console.log(userId);

  const handleDeleteButton = async () => {
    toast.success("adding event deleted ", {
      autoClose: 4000,
      position: "top-center",
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/manage/${userId}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log("delete response", data);
    window.location.reload();
  };

  return (
    <AlertDialog>
      {/* <Button color="danger" variant="light" size="sm">
        Cancel
      </Button> */}
      <Button variant="danger" type="submit">
      <RiDeleteBin3Line />
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Confirm Cancellation</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-slate-600">
                Are you sure you want to cancel this enrollment? This action
                cannot be undone and you will lose access to the course
                materials.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                keep Event
              </Button>
              <Button
                onClick={handleDeleteButton}
                slot="close"
                variant="danger"
                className="font-bold"
              >
                Delete Event
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DeleteAddingButton;