import { Button } from "@mui/material";
import { useEffect } from "react";

function UserPanelLayout({ title, children, onSave, onCancel }) {
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "Escape") onCancel();
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50"
      // onClick={onCancel}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
        // onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white pt-6 pb-2 px-2 z-20">
          <h2 className="text-4xl font-bold mb-4 font-poppins">{title}</h2>
        </div>

        <form>
          <div className="w-full space-y-4">
            {children}

            {/* BUTTONS */}
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="contained"
                onClick={onSave}
                sx={{
                  color: "white",
                  backgroundColor: "#FC8721",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  width: "100%",
                }}
              >
                Zapisz
              </Button>

              <Button
                variant="contained"
                onClick={onCancel}
                sx={{
                  backgroundColor: "#6D727F",
                  color: "white",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  width: "100%",
                }}
              >
                Anuluj
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPanelLayout;
