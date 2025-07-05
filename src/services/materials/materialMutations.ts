
import { supabase } from '@/integrations/supabase/client';
import { Material, MaterialType } from '@/types/material';

export const addMaterial = async (material: Omit<Material, 'id' | 'dateAdded'>): Promise<Material | null> => {
  try {
    console.log('Adding material to Supabase:', material);
    
    const insertData = {
      title: material.title,
      description: material.description,
      type: material.type,
      url: material.url || null,
      image_url: material.imageUrl || null
    };
    
    console.log('Insert data prepared:', insertData);
    
    // Проверим подключение к базе данных
    const { count, error: countError } = await supabase
      .from('materials')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Connection test failed:', countError);
    } else {
      console.log('Connection test successful, current materials count:', count);
    }
    
    const { data, error } = await supabase
      .from('materials')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
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
    console.error('Error in addMaterial function:', error);
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
