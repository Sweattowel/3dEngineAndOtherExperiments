def convert():
    with open(r"src\app\Components\CustomBuilt\Data\ToUse\teapot.obj", 'r') as file:
        importedData = file.readlines()

    vertices = []
    faces = []
    triangleCoordinates = []

    for line in importedData:
        parts = line.split()
        if len(parts) == 0:
            continue
        if parts[0] == "v":
            vertices.append([float(parts[1]), float(parts[2]), float(parts[3]), 1])
        elif parts[0] == 'f':
            faces.append([int(parts[1]), int(parts[2]), int(parts[3])])
    for i in range(0, len(vertices), 1):
        triangleCoordinates.append(
            vertices[i]
        )

    js_object = {
        "name": "Teapot", # type: ignore
        "coordinates": [0, 0, 0], # type: ignore
        "triangleCoordinates": triangleCoordinates, # type: ignore
        "faceCoordinates": faces, # type: ignore
    }
    return js_object

def write_new_file():
    print("Beginning conversion")
    js_object = convert()
    print("JS object created, beginning to write")

    with open(r"src\app\Components\CustomBuilt\Data\ShapeFolder.tsx", "w") as file_writing:
        # Write the export statement
        file_writing.write("interface objectStructure {\n name: string \n coordinates: number[] \n triangleCoordinates: number[][] \n faceCoordinates: number[][] \n } \n")

        file_writing.write("export const objects : objectStructure[] = [\n")

        # Convert js_object to a string and write it
        file_writing.write(f"    {js_object},\n")

        # Close the array and the export
        file_writing.write("];\n")
    
    print("Finished writing and converting data")

# Run the function to write the file
write_new_file()