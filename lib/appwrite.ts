import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage, TablesDB } from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "in.denim.fooddelivery",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: '697b5f1e00347ddce219',
  bucketId: '697c515b00286a6febaf',
  userTableId: 'user',
  categoriesTableId: 'categories',
  menuTableId: 'menu',
  customizationsTableId: 'customizations',
  menuCustomizationsTableId: 'menu_customizations'
}

export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setPlatform(appwriteConfig.platform).setProject(appwriteConfig.projectId)

export const account = new Account(client)
export const tablesDb = new TablesDB(client)
export const avatars = new Avatars(client)
export const storage = new Storage(client)

export const createUser = async ({ email, password, name }: CreateUserParams) => {
  try {
    const newAccount = await account.create({ userId: ID.unique(), email, password, name });
    if (!newAccount) throw Error('Failed to create account');

    await signIn({ email, password })

    const avatarUrl = avatars.getInitialsURL(name)
    return tablesDb.createRow({ databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userTableId, rowId: ID.unique(), data: { name, email, accountId: newAccount.$id, avatar: avatarUrl } })
  } catch (e) {
    throw new Error(e as string)
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    await account.createEmailPasswordSession({ email, password })
  } catch (e) {
    throw new Error(e as string)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error('No current account')

    const currentUser = await tablesDb.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      queries: [Query.equal('accountId', currentAccount.$id)]
    })

    if (!currentUser) throw Error('No current user')
    return currentUser.rows[0];
  } catch (e) {
    console.error(e)
    throw new Error(e as string)
  }
}

export const getMenu = async ({category, query}: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal('categories', category));
    if (query) queries.push(Query.equal('name', query));

    const menu = await tablesDb.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuTableId,
      queries
    })

    return menu.rows;
  } catch (e) {
    throw new Error(e as string) 
  }
}

export const getCategories = async () => {
  try {
    const categories = await tablesDb.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId
    });

    return categories.rows;
  } catch (err) {
    throw new Error(err as string) 
  }
}