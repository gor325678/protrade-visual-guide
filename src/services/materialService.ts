import { supabase } from '@/integrations/supabase/client';
import { Material, MaterialType } from '../types/material';

// Database operations
export const getAllMaterials = async (): Promise<Material[]> => {
  try {
    console.log('Fetching materials from Supabase...');
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }

    console.log('Materials fetched successfully:', data?.length || 0);
    return data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as MaterialType,
      url: item.url,
      imageUrl: item.image_url,
      dateAdded: new Date(item.date_added)
    })) || [];
  } catch (error) {
    console.error('Error in getAllMaterials:', error);
    return [];
  }
};

export const getMaterialById = async (id: string): Promise<Material | undefined> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching material:', error);
      return undefined;
    }

    if (!data) return undefined;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as MaterialType,
      url: data.url,
      imageUrl: data.image_url,
      dateAdded: new Date(data.date_added)
    };
  } catch (error) {
    console.error('Error in getMaterialById:', error);
    return undefined;
  }
};

export const addMaterial = async (material: Omit<Material, 'id' | 'dateAdded'>): Promise<Material | null> => {
  try {
    console.log('Adding material to Supabase:', material);
    
    // Подготавливаем данные для вставки
    const insertData = {
      title: material.title,
      description: material.description,
      type: material.type,
      url: material.url || null,
      image_url: material.imageUrl || null
    };
    
    console.log('Insert data:', insertData);
    
    const { data, error } = await supabase
      .from('materials')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!data) {
      console.warn('No data returned from insert operation');
      return null;
    }

    console.log('Material added successfully:', data);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as MaterialType,
      url: data.url,
      imageUrl: data.image_url,
      dateAdded: new Date(data.date_added)
    };
  } catch (error) {
    console.error('Error in addMaterial:', error);
    throw error;
  }
};

export const updateMaterial = async (id: string, updates: Partial<Omit<Material, 'id' | 'dateAdded'>>): Promise<Material | null> => {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.url !== undefined) updateData.url = updates.url || null;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl || null;

    const { data, error } = await supabase
      .from('materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating material:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as MaterialType,
      url: data.url,
      imageUrl: data.image_url,
      dateAdded: new Date(data.date_added)
    };
  } catch (error) {
    console.error('Error in updateMaterial:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting material:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMaterial:', error);
    return false;
  }
};

export const getImages = async (): Promise<Material[]> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('type', 'image')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as MaterialType,
      url: item.url,
      imageUrl: item.image_url,
      dateAdded: new Date(item.date_added)
    })) || [];
  } catch (error) {
    console.error('Error in getImages:', error);
    return [];
  }
};

export const uploadFile = async (file: File, bucket: string = 'materials'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};
