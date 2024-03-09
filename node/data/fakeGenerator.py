import json
LABROOMS = ["GK301", "GK402", "GK206", "GK307", "GK208"]
WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


def save_to_json(data, output_file):
    with open(output_file, 'w') as outfile:
        json.dump(data, outfile, indent=2)


if __name__ == "__main__":
    lab_name = "GK402"
    seat_number = "001"
    seat_time_id = 20
    student_user = None
    is_anon = False

    seat_list = []

    for day in WEEKDAYS:
        for name in LABROOMS:
            for i in range(1, 41):
                for t in range(1, 21):


                    seat_entry = {
                        "labName": name,
                        "weekDay": day,
                        "seatNumber": f"{i}",
                        "seatTimeID": t,
                        "studentUser": student_user,
                        "isAnon": is_anon
                    }
                    seat_list.append(seat_entry)




    output_filename = "seatData.json"
    save_to_json(seat_list, output_filename)

    print(f"Generated {len(LABROOMS)*40*20*7} entries. Check {output_filename} for the generated data.")