import { ID } from "react-native-appwrite";
import {Directory, File, Paths} from 'expo-file-system';
import { appwriteConfig, tablesDb, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(tableId: string): Promise<void> {
  const list = await tablesDb.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: tableId,
  });

  await Promise.all(
    list.rows.map((row) =>
      tablesDb.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: row.$id,
      }),
    ),
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles({
    bucketId: appwriteConfig.bucketId,
  });

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile({
        bucketId: appwriteConfig.bucketId,
        fileId: file.$id,
      }),
    ),
  );
}

async function uploadImageToStorage(imageUrl: string) {
  const destination = new Directory(Paths.cache, 'assets');
  
  try {
    destination.create();
    const output = await File.downloadFileAsync(imageUrl, destination);
    const file = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: "image/jpeg",
        size: output.size,
        uri: output.uri,
      },
    });

    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
  } finally {
    destination.delete();
  }
}

async function seed(): Promise<void> {
  // 1. Clear all
  // await clearAll(appwriteConfig.categoriesTableId);
  // await clearAll(appwriteConfig.customizationsTableId);
  await clearAll(appwriteConfig.menuTableId);
  await clearAll(appwriteConfig.menuCustomizationsTableId);
  await clearStorage();

  // 2. Create Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const row = await tablesDb.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId,
      rowId: ID.unique(),
      data: {
        name: cat.name,
        description: cat.description,
      },
    });
    categoryMap[cat.name] = row.$id;
  }

  // 3. Create Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const row = await tablesDb.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.customizationsTableId,
      rowId: ID.unique(),
      data: {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      },
    });
    customizationMap[cus.name] = row.$id;
  }

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const uploadedImage = await uploadImageToStorage(item.image_url);

    const row = await tablesDb.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuTableId,
      rowId: ID.unique(),
      data: {
        name: item.name,
        description: item.description,
        image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      },
    });

    menuMap[item.name] = row.$id;

    // 5. Create menu_customizations
    for (const cusName of item.customizations) {
      await tablesDb.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.menuCustomizationsTableId,
        rowId: ID.unique(),
        data: {
          menu: row.$id,
          customizations: customizationMap[cusName],
        },
      });
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
