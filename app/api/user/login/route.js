import { NextResponse } from "next/server";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const {email, password} = await req.json();
    const params = {
      TableName: "AIR_ADMINS",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const command = new QueryCommand(params);
    const result = await ddbDocClient.send(command);

    if (result.Count == 0)
      return NextResponse.json({ msg: "User not found!" }, { status: 404 });

    const user = result.Items[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    
    if (!isMatch)
      return NextResponse.json({ msg: "Password is wrong!" }, { status: 400 });
    
    delete user.password;
    
    const rolRes = await ddbDocClient.send(new GetCommand({
      TableName: "Role",
      Key: { name: user.role },
    }));
    const roleData = rolRes.Item;

    return NextResponse.json(
      {...user, role: roleData.name, actions: Array.from(roleData.actions)},
      { status: 200 }
    );
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
