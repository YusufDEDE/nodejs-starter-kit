import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';  // Assuming your Sequelize instance is set up here

// Define interface for User
export interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    createdAt?: Date;
}

// Define the optional attributes for Sequelize model creation
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
}

// Initialize the model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize, // Sequelize instance
        modelName: 'User',
        tableName: 'users',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);
